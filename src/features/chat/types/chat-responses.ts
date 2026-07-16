import type {
  ChatHistoryPagination,
  ChatListItem,
  ChatMessage,
} from "@/features/chat/types/chat";

/** Response from GET `/chat` */
export type ListChatsResponse = {
  chats: ChatListItem[];
};

/** Response from GET `/chat/history` */
export type GetChatHistoryResponse = {
  messages: ChatMessage[];
  pagination: ChatHistoryPagination;
};

/** Response from POST `/chat/send` and POST `/chat/send-file` (201) */
export type SendChatResponse = {
  message: ChatMessage & { receiverId: string };
};

/** Response from POST `/chat/threads/{threadId}/read` */
export type MarkThreadReadResponse = {
  message: string;
  lastReadAt: string;
};
