"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  name: string
  image?: string | null
  className?: string
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar className={className}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
} 