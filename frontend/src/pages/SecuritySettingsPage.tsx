import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useEffect } from 'react';
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SecuritySettingsPage() {
  const navigate = useNavigate();
  const { identity, isLoginSuccess } = useInternetIdentity();

  useEffect(() => {
    if (!isLoginSuccess || !identity) {
      navigate({ to: '/' });
    }
  }, [isLoginSuccess, identity, navigate]);

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
          <p className="text-muted-foreground">
            Manage your vault security and encryption settings
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Encryption Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Encryption Status</CardTitle>
                  <CardDescription>Your vault is protected with end-to-end encryption</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Canister-Owned Encryption</p>
                    <p className="text-sm text-muted-foreground">
                      All sensitive data is encrypted before storage
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Active
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Internet Identity Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Secure authentication via Internet Computer
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Active
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Security Preferences</CardTitle>
              <CardDescription>Configure your security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-lock">Auto-lock vault</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically lock your vault after 15 minutes of inactivity
                  </p>
                </div>
                <Switch id="auto-lock" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="clipboard">Clear clipboard</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically clear copied passwords after 30 seconds
                  </p>
                </div>
                <Switch id="clipboard" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-visibility">Show password by default</Label>
                  <p className="text-sm text-muted-foreground">
                    Display passwords in plain text when viewing items
                  </p>
                </div>
                <Switch id="password-visibility" />
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your Internet Identity details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Principal ID</Label>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <code className="text-sm break-all">
                    {identity?.getPrincipal().toString() || 'Not available'}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your vault</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <div>
                  <p className="font-medium">Delete all vault data</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all items in your vault
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
