import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // Find or create a conversation for a product
  @Post()
  @HttpCode(HttpStatus.OK)
  async findOrCreateConversation(
    @CurrentUser() user: any,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationsService.findOrCreateConversation(user.sub, dto);
  }

  // Get user's conversation inbox
  @Get()
  async getUserConversations(@CurrentUser() user: any) {
    return this.conversationsService.getUserConversations(user.sub);
  }

  // Get conversation metadata/header
  @Get(':id')
  async getConversation(@Param('id') id: string, @CurrentUser() user: any) {
    return this.conversationsService.getConversationById(id, user.sub);
  }

  // Get all messages in a conversation
  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @CurrentUser() user: any) {
    return this.conversationsService.getMessages(id, user.sub);
  }

  // Send a message in a conversation
  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: SendMessageDto,
  ) {
    return this.conversationsService.sendMessage(id, user.sub, dto);
  }
}
