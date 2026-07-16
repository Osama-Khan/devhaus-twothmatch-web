import { appRoutes } from "@/lib/routes";

type BuildChatPathParams = {
  receiverId: string;
  name?: string;
  avatar?: string | null;
};

/**
 * App path to open a chat with a user (`/chat?receiverId=…`).
 * Optional `name` / `avatar` seed the draft header when no thread exists yet.
 */
export function buildChatPath({
  receiverId,
  name,
  avatar,
}: BuildChatPathParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set("receiverId", receiverId);

  const trimmedName = name?.trim();
  if (trimmedName) {
    searchParams.set("name", trimmedName);
  }

  if (avatar) {
    searchParams.set("avatar", avatar);
  }

  return `${appRoutes.chat._self.path}?${searchParams.toString()}`;
}
