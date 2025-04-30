"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ProfileSettingsProps {
  onChangesMade?: () => void;
}

export function ProfileSettings({ onChangesMade }: ProfileSettingsProps) {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-500/5 dark:to-purple-500/5" />
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="john@example.com" 
            className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-slate-700 dark:text-slate-300">Bio</Label>
          <Input 
            id="bio" 
            placeholder="Tell us about yourself" 
            className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
          />
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 hover:shadow-lg dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}