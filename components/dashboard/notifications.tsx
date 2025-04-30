"use client";

import { Card } from "@/components/ui/card";
import { Bell, Circle } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function Notifications() {
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Investment Update",
      message: "Your investment in Project Alpha has increased by 5%",
      time: "2 hours ago",
      read: false
    },
    {
      id: "2",
      title: "New Project Available",
      message: "Check out the latest investment opportunity in creative tech",
      time: "5 hours ago",
      read: true
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Notifications</h3>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0 mt-1">
              <Circle className={`h-2 w-2 ${notification.read ? 'text-muted-foreground' : 'text-primary fill-current'}`} />
            </div>
            <div>
              <h4 className="text-sm font-medium">{notification.title}</h4>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}