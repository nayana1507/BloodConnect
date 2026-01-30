'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Database, Lock, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-foreground/60 mt-2">Configure platform settings and preferences</p>
      </div>

      {/* General Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            General Settings
          </CardTitle>
          <CardDescription>Platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="platformName">Platform Name</Label>
            <Input
              id="platformName"
              defaultValue="BloodConnect"
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              defaultValue="support@bloodconnect.com"
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="border-border"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded border border-border">
            <div>
              <Label className="font-semibold text-foreground">Maintenance Mode</Label>
              <p className="text-sm text-foreground/60 mt-1">Disable platform for maintenance</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Email Settings
          </CardTitle>
          <CardDescription>Configure email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded border border-border">
            <div>
              <Label className="font-semibold text-foreground">Send Email Notifications</Label>
              <p className="text-sm text-foreground/60 mt-1">Enable email notifications for users</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded border border-border">
            <div>
              <Label className="font-semibold text-foreground">Weekly Digest</Label>
              <p className="text-sm text-foreground/60 mt-1">Send weekly summary to admins</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded border border-border">
            <div>
              <Label className="font-semibold text-foreground">Alert on Critical Events</Label>
              <p className="text-sm text-foreground/60 mt-1">Notify admins of critical issues</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>Platform security configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded border border-border">
            <div>
              <Label className="font-semibold text-foreground">Two-Factor Authentication</Label>
              <p className="text-sm text-foreground/60 mt-1">Require 2FA for all admins</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded border border-border">
            <div>
              <Label className="font-semibold text-foreground">Data Encryption</Label>
              <p className="text-sm text-foreground/60 mt-1">Enable end-to-end encryption</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Button variant="outline" className="w-full border-border bg-transparent">
            Reset All Security Keys
          </Button>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Database Settings
          </CardTitle>
          <CardDescription>Database and backup configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded border border-border">
            <div>
              <Label className="font-semibold text-foreground">Auto Backup</Label>
              <p className="text-sm text-foreground/60 mt-1">Daily automatic backups</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Button variant="outline" className="w-full border-border bg-transparent">
            Create Manual Backup
          </Button>

          <Button variant="outline" className="w-full border-border bg-transparent">
            View Backup History
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-6">
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          Save Changes
        </Button>
        <Button variant="outline" className="flex-1 border-border bg-transparent">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
