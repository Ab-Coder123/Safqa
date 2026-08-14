import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ProductStatus, NotificationType } from '@safqa/types';

@Injectable()
export class ConversationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ─── START / GET CONVERSATION ──────────────────────────────────────────────
  async findOrCreateConversation(userId: string, dto: CreateConversationDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.product_id },
      select: { id: true, user_id: true, title: true, status: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Business Rule: Unavailable products block new chats
    if (product.status === ProductStatus.ARCHIVED || product.status === ProductStatus.SOLD) {
      throw new BadRequestException('New conversations cannot be started for unavailable products');
    }

    // Business Rule: No Self-Messaging
    if (product.user_id === userId) {
      throw new BadRequestException('You cannot start a conversation with yourself regarding your own product');
    }

    const sellerId = product.user_id;

    // Check if conversation already exists between these two users regarding this product
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        product_id: dto.product_id,
        OR: [
          { user_one_id: userId, user_two_id: sellerId },
          { user_one_id: sellerId, user_two_id: userId },
        ],
      },
      include: {
        user_one: { select: { id: true, full_name: true, avatar_url: true } },
        user_two: { select: { id: true, full_name: true, avatar_url: true } },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          user_one_id: userId,
          user_two_id: sellerId,
          product_id: dto.product_id,
        },
        include: {
          user_one: { select: { id: true, full_name: true, avatar_url: true } },
          user_two: { select: { id: true, full_name: true, avatar_url: true } },
        },
      });
    }

    return conversation;
  }

  // ─── GET USER CONVERSATIONS (Inbox) ───────────────────────────────────────
  async getUserConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ user_one_id: userId }, { user_two_id: userId }],
      },
      orderBy: { last_message_at: 'desc' },
      include: {
        user_one: { select: { id: true, full_name: true, avatar_url: true } },
        user_two: { select: { id: true, full_name: true, avatar_url: true } },
        messages: {
          take: 1,
          orderBy: { created_at: 'desc' },
        },
      },
    });

    return conversations.map((conv) => {
      const otherUser = conv.user_one_id === userId ? conv.user_two : conv.user_one;
      const lastMessage = conv.messages[0] || null;
      return {
        id: conv.id,
        product_id: conv.product_id,
        other_user: otherUser,
        last_message: lastMessage,
        updated_at: conv.last_message_at || conv.created_at,
      };
    });
  }

  // ─── GET CONVERSATION MESSAGES ────────────────────────────────────────────
  async getMessages(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Security Check: Participant Verification
    if (conversation.user_one_id !== userId && conversation.user_two_id !== userId) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    // Mark messages from other user as read
    await this.prisma.message.updateMany({
      where: {
        conversation_id: conversationId,
        sender_id: { not: userId },
        is_read: false,
      },
      data: { is_read: true },
    });

    const messages = await this.prisma.message.findMany({
      where: { conversation_id: conversationId },
      orderBy: { created_at: 'asc' },
      include: {
        sender: { select: { id: true, full_name: true, avatar_url: true } },
      },
    });

    return messages;
  }

  // ─── SEND MESSAGE ─────────────────────────────────────────────────────────
  async sendMessage(conversationId: string, senderId: string, dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user_one: { select: { id: true, status: true, full_name: true } },
        user_two: { select: { id: true, status: true, full_name: true } },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Security Check: Participant Verification
    if (conversation.user_one_id !== senderId && conversation.user_two_id !== senderId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const recipientId = conversation.user_one_id === senderId ? conversation.user_two_id : conversation.user_one_id;
    const recipient = conversation.user_one_id === senderId ? conversation.user_two : conversation.user_one;
    const sender = conversation.user_one_id === senderId ? conversation.user_one : conversation.user_two;

    // Account check: suspended user blocks chat
    if (recipient.status === 'SUSPENDED' || recipient.status === 'DELETED') {
      throw new BadRequestException('Unable to send message. Recipient account is suspended or unavailable.');
    }

    const now = new Date();

    // 1. Create message
    const message = await this.prisma.message.create({
      data: {
        conversation_id: conversationId,
        sender_id: senderId,
        content: dto.content,
      },
      include: {
        sender: { select: { id: true, full_name: true, avatar_url: true } },
      },
    });

    // 2. Update conversation last_message_at
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { last_message_at: now },
    });

    // 3. Trigger Notification for recipient per Messaging_Workflow.md
    await this.notificationsService.createNotification({
      user_id: recipientId,
      title: `رسالة جديدة من ${sender.full_name}`,
      body: dto.content.length > 50 ? `${dto.content.substring(0, 50)}...` : dto.content,
      type: NotificationType.COMMENT,
    });

    return message;
  }
}
