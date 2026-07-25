"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import { usePresence } from "@/features/chat/hooks/use-presence";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  /** User id used for presence subscription when `showPresence` is on */
  userId: string;
  /** Display name for alt text and initials fallback */
  name: string;
  /** Avatar image URL */
  src?: string | null;
  /** Subscribe to live online/offline and render a status badge */
  showPresence?: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
  fallbackClassName?: string;
};

/**
 * User avatar with optional live presence badge.
 * When `showPresence` is true, subscribes via Socket.IO for that `userId`.
 */
export function UserAvatar({
  userId,
  name,
  src,
  showPresence = false,
  size = "default",
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const { getPresence, isReady } = usePresence({
    userIds: showPresence && userId ? [userId] : [],
    enabled: showPresence && Boolean(userId),
  });

  const presence = showPresence ? getPresence(userId) : undefined;
  const isOnline = presence?.online === true;
  const showBadge = showPresence && isReady && presence != null;

  return (
    <Avatar size={size} className={className}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className={fallbackClassName}>
        {getInitials(name)}
      </AvatarFallback>
      {showBadge ? (
        <AvatarBadge
          aria-label={isOnline ? "Online" : "Offline"}
          title={isOnline ? "Online" : "Offline"}
          className={cn(
            "ring-background",
            isOnline ? "bg-chart-2" : "bg-muted-foreground"
          )}
        />
      ) : null}
    </Avatar>
  );
}
