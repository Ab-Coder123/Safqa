import { apiClient } from '@/lib/api';

export interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: { id: string; full_name: string; avatar_url?: string | null };
}

export interface ConversationParticipant {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  phone_number?: string | null;
}

export interface ConversationProduct {
  id: string;
  title: string;
  price: number;
  status: string;
  whatsapp_number?: string | null;
  category?: { id: string; name: string };
  media?: { id?: string; url: string }[];
}

export interface ConversationItem {
  id: string;
  product_id?: string | null;
  other_user: ConversationParticipant;
  product?: ConversationProduct | null;
  last_message?: {
    id: string;
    content: string;
    created_at: string;
    is_read: boolean;
    sender_id: string;
  } | null;
  unread_count?: number;
  created_at?: string;
  updated_at: string;
}

export const conversationsApi = {
  getConversations(): Promise<ConversationItem[]> {
    return apiClient<ConversationItem[]>('/conversations', {
      method: 'GET',
      auth: true,
    });
  },

  getConversation(id: string): Promise<ConversationItem> {
    return apiClient<ConversationItem>(`/conversations/${id}`, {
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

  createConversation(data: { productId: string }): Promise<ConversationItem> {
    return apiClient<ConversationItem>('/conversations', {
      method: 'POST',
      body: { product_id: data.productId }, // ✅
      auth: true,
    });
  },
};
