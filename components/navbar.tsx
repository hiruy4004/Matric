"use client"

import Link from "next/link"
import { GraduationCap, LogOut, User, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { UserAvatar } from './user-avatar'

export function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
          // Remove automatic redirect to login
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-black text-white shadow-sm">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-5 w-5" />
          <span>Practice Arena</span>
        </Link>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-zinc-700 p-1 px-3 hover:bg-zinc-800 hover:border-violet-500/50 transition-all duration-200">
                <UserAvatar name={user.user_metadata?.name || user.email} />
                <span className="text-sm font-medium text-white">{user.user_metadata?.name || user.email}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg animate-in fade-in-80 slide-in-from-top-5">
              <DropdownMenuLabel className="font-normal border-b border-zinc-800">
                <div className="flex flex-col space-y-1 px-1 py-2">
                  <p className="text-sm font-medium text-white">{user.user_metadata?.name}</p>
                  <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <div className="p-1">
                <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 rounded-md transition-colors duration-150 cursor-pointer">
                  <Link href="/profile" className="flex items-center text-zinc-200 px-2 py-1.5">
                    <User className="mr-2 h-4 w-4 text-violet-400" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 rounded-md transition-colors duration-150 cursor-pointer">
                  <Link href="/settings" className="flex items-center text-zinc-200 px-2 py-1.5">
                    <Settings className="mr-2 h-4 w-4 text-violet-400" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 h-px bg-zinc-800" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="hover:bg-red-900/20 focus:bg-red-900/20 text-red-400 rounded-md transition-colors duration-150 cursor-pointer px-2 py-1.5"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}