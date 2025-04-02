"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Settings, Trophy, Target, BookOpen, Award, Clock, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    subjects: {
      math: { total: 0, correct: 0 },
      english: { total: 0, correct: 0 },
      science: { total: 0, correct: 0 }
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch user stats from your quiz results table
        const { data: quizResults } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id);

        if (quizResults) {
          // Calculate statistics
          const stats = calculateStats(quizResults);
          setStats(stats);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const calculateStats = (results: any[]) => {
    const stats = {
      totalQuestions: results.length,
      correctAnswers: results.filter(r => r.is_correct).length,
      accuracy: 0,
      subjects: {
        math: { total: 0, correct: 0 },
        english: { total: 0, correct: 0 },
        science: { total: 0, correct: 0 }
      }
    };

    stats.accuracy = (stats.correctAnswers / stats.totalQuestions) * 100 || 0;

    // Calculate per subject stats
    results.forEach(result => {
      if (!result?.subject) return;
      
      try {
        const subject = result.subject.toLowerCase();
        stats.subjects[subject] ??= { total: 0, correct: 0 };
        stats.subjects[subject].total++;
        if (result.is_correct) {
          stats.subjects[subject].correct++;
        }
      } catch (error) {
        console.error('Error processing result:', error);
      }
    });

    return stats;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
          My Profile
        </h1>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-full border border-zinc-700 p-1 px-3 hover:bg-zinc-800 hover:border-violet-500/50 transition-all duration-200">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-violet-600 text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white">{user.user_metadata?.name || user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg">
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
        ) : (
          <Link href="/login">
            <Button variant="outline" size="sm" className="rounded-full px-4 py-2">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
        )}
      </div>

      {user ? (
        <div className="space-y-8">
          {/* User Summary Card */}
          <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-violet-600/20 to-indigo-600/20"></div>
            <CardContent className="pt-8 relative">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-8">
                <Avatar className="h-24 w-24 border-4 border-zinc-900 shadow-xl">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-violet-600 text-white text-2xl">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{user?.user_metadata?.name || 'Student'}</h2>
                  <p className="text-zinc-400">{user?.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400 border border-violet-500/20">
                      <Award className="mr-1 h-3 w-3" />
                      Level {Math.floor(stats.totalQuestions / 10) + 1}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/20">
                      <Trophy className="mr-1 h-3 w-3" />
                      {stats.totalQuestions}+ Questions
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
                      <Calendar className="mr-1 h-3 w-3" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-violet-500/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 rounded-full bg-violet-500/10">
                    <BookOpen className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold">{stats.totalQuestions}</h3>
                  <p className="text-zinc-400 text-sm">Total Questions</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-violet-500/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 rounded-full bg-green-500/10">
                    <Award className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">{stats.correctAnswers}</h3>
                  <p className="text-zinc-400 text-sm">Correct Answers</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-violet-500/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 rounded-full bg-blue-500/10">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">{stats.accuracy.toFixed(1)}%</h3>
                  <p className="text-zinc-400 text-sm">Accuracy</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Progress */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-violet-400" />
                Subject Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(stats.subjects).map(([subject, data]) => (
                  <div key={subject} className="group">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium capitalize">{subject}</span>
                        <span className="ml-2 text-xs text-zinc-500">
                          {data.correct}/{data.total} correct
                        </span>
                      </div>
                      <span className="text-sm font-medium group-hover:text-violet-400 transition-colors">
                        {((data.correct / data.total) * 100 || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(data.correct / data.total) * 100 || 0} 
                        className="h-2 bg-zinc-800" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 max-w-md">
            <User className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Not Signed In</h2>
            <p className="text-zinc-400 mb-6">Sign in to view your profile and track your progress</p>
            <Link href="/login">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}