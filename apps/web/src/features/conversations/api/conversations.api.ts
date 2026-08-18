import { apiClient } from '@/lib/api';

export interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: { id: string; full_name: string; avatar_url?: string };
}

export interface ConversationItem {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  product: { id: string; title: string; price: number; media?: { url: string }[] };
  buyer: { id: string; full_name: string; avatar_url?: string };
  seller: { id: string; full_name: string; avatar_url?: string };
  messages?: MessageItem[];
}

export const conversationsApi = {
  getConversations(): Promise<ConversationItem[]> {
    return apiClient<ConversationItem[]>('/conversations', {
      method: 'GET',
      auth: true,
    });
  },

  getMessages(conversationId: string): Promise<MessageItem[]> {
    return apiClient<MessageItem[]>(`/conversations/${conversationId}/messages`, {
      method: 'GET',
      auth: true,
    });
  },

  sendMessage(conversationId: string, content: string): Promise<MessageItem> {
    return apiClient<MessageItem>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: { content },
      auth: true,
    });
  },

  createConversation(productId: string): Promise<ConversationItem> {
    return apiClient<ConversationItem>('/conversations', {
      method: 'POST',
      body: { product_id: productId },
      auth: true,
    });
  },
};
