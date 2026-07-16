export type {
  ChatAttachment,
  ChatAttachmentKind,
  ChatDisplayMessage,
  ChatHistoryPagination,
  ChatListItem,
  ChatListMessage,
  ChatMessage,
  ChatMessageDeliveryStatus,
  ChatOtherUser,
  GetChatHistoryParams,
} from "@/features/chat/types/chat";

export {
  CHAT_HISTORY_PAGE_SIZE,
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_SEND_FILE_MAX_BYTES,
  CHAT_SEND_FILE_MAX_COUNT,
} from "@/features/chat/types/chat";

export type {
  SendChatFileRequest,
  SendChatRequest,
} from "@/features/chat/types/chat-requests";

export type {
  GetChatHistoryResponse,
  ListChatsResponse,
  MarkThreadReadResponse,
  SendChatResponse,
} from "@/features/chat/types/chat-responses";

export type {
  ChatPresenceSnapshot,
  ChatPresenceState,
  ChatSocketAck,
  ChatSocketErrorAck,
  ChatSocketMessageEvent,
  ChatSocketOkAck,
  ChatSocketPresenceEvent,
  ChatSocketReadEvent,
  ChatSocketTypingEvent,
  PresenceSubscribeAck,
} from "@/features/chat/types/chat-socket";

export {
  CHAT_TYPING_EMIT_THROTTLE_MS,
  CHAT_TYPING_INDICATOR_TIMEOUT_MS,
  ChatSocketClientEvents,
  ChatSocketServerEvents,
} from "@/features/chat/types/chat-socket";
