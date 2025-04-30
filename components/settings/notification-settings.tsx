"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface NotificationSettingsProps {
  onChangesMade?: () => void;
}

export function NotificationSettings({ onChangesMade }: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
          </div>
          <Switch onCheckedChange={() => onChangesMade?.()} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Investment Updates</Label>
            <p className="text-sm text-muted-foreground">Get notified about your investment performance</p>
          </div>
          <Switch onCheckedChange={() => onChangesMade?.()} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Security Alerts</Label>
            <p className="text-sm text-muted-foreground">Receive alerts about security events</p>
          </div>
          <Switch onCheckedChange={() => onChangesMade?.()} />
        </div>
        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  );
}