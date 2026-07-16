"use client";

import type {
  GetChatHistoryParams,
  GetChatHistoryResponse,
  ListChatsResponse,
  MarkThreadReadResponse,
  SendChatFileRequest,
  SendChatRequest,
  SendChatResponse,
} from "@/features/chat/types";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";
import { createRoute } from "@/lib/utils/route";

function buildHistoryPath(params: GetChatHistoryParams): string {
  const searchParams = new URLSearchParams();

  if (params.threadId) {
    searchParams.set("threadId", params.threadId);
  }
  if (params.receiverId) {
    searchParams.set("receiverId", params.receiverId);
  }
  if (params.beforeMessageId) {
    searchParams.set("beforeMessageId", params.beforeMessageId);
  }

  const query = searchParams.toString();
  const base = externalApiRoutes.chat.history._self.path;

  return query ? `${base}?${query}` : base;
}

function markThreadReadPath(threadId: string): string {
  return createRoute(externalApiRoutes.chat.markRead._self, { threadId }).path;
}

function buildSendFileFormData(body: SendChatFileRequest): FormData {
  const formData = new FormData();
  formData.append("receiverId", body.receiverId);

  if (body.caption != null && body.caption !== "") {
    formData.append("caption", body.caption);
  }

  const files = Array.isArray(body.files) ? body.files : [body.files];
  for (const file of files) {
    formData.append("file", file);
  }

  return formData;
}

/**
 * Client-side chat REST service under `/chat`.
 * Auth + verified user required on all endpoints.
 */
export const chatService = {
  /**
   * GET `/chat` — all chat threads for the authenticated user.
   * Each row includes `otherUser`, latest `message`, `lastReadAt`, mute/archive flags.
   */
  listChats(): Promise<AppResponseType<ListChatsResponse>> {
    return apiFetcher.get<ListChatsResponse>(externalApiRoutes.chat._self.path);
  },

  /**
   * GET `/chat/history` — messages for a thread (`createdAt` DESC, newest first).
   * Prefer `threadId`; use `receiverId` when the thread id is unknown.
   * Optional `beforeMessageId` cursor loads older pages (up to 30 per request).
   */
  getHistory(
    params: GetChatHistoryParams
  ): Promise<AppResponseType<GetChatHistoryResponse>> {
    return apiFetcher.get<GetChatHistoryResponse>(buildHistoryPath(params));
  },

  /**
   * POST `/chat/send` — send a text message (201).
   * Requires a confirmed/completed interview or mutual match with the receiver.
   * Server also emits Socket.IO `message` to sender and receiver rooms.
   */
  sendMessage(
    body: SendChatRequest
  ): Promise<AppResponseType<SendChatResponse>> {
    return apiFetcher.post<SendChatResponse>(
      externalApiRoutes.chat.send._self.path,
      body
    );
  },

  /**
   * POST `/chat/send-file` — send one or more file attachments (multipart, 201).
   * Max 5 files, 50MB each. Optional `caption`; default message text is `"Uploaded"`.
   */
  sendFile(
    body: SendChatFileRequest
  ): Promise<AppResponseType<SendChatResponse>> {
    return apiFetcher.post<SendChatResponse>(
      externalApiRoutes.chat.sendFile._self.path,
      buildSendFileFormData(body)
    );
  },

  /**
   * POST `/chat/threads/{threadId}/read` — mark a thread as read.
   * Also emits Socket.IO `read` to other participants.
   */
  markThreadRead(
    threadId: string
  ): Promise<AppResponseType<MarkThreadReadResponse>> {
    return apiFetcher.post<MarkThreadReadResponse>(
      markThreadReadPath(threadId)
    );
  },
};
