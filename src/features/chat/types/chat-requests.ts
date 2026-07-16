/** Body for POST `/chat/send` (JSON) */
export type SendChatRequest = {
  receiverId: string;
  /** Message text (max 1000 characters) */
  message: string;
};

/** Body fields for POST `/chat/send-file` (multipart/form-data) */
export type SendChatFileRequest = {
  receiverId: string;
  /** Optional caption; omit/empty → server sets message to `"Uploaded"` */
  caption?: string;
  /** One or more files (max 5) */
  files: File | readonly File[];
};
