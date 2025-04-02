"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface UserAvatarProps {
  src?: string;
  name: string;
}

export function UserAvatar({ src, name }: UserAvatarProps) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  
  return (
    <Avatar>
      {src ? (
        <AvatarImage src={src} alt={name} />
      ) : (
        <AvatarFallback className="bg-blue-600 text-white">
          {initial}
        </AvatarFallback>
      )}
    </Avatar>
  )
}