import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, CreditCard, FileText, User, Loader2 } from 'lucide-react';
import type { VaultItemType } from '../pages/VaultPage';
import {
  useCreateLogin,
  useCreateCreditCard,
  useCreateSecureNote,
  useCreateIdentity,
} from '../hooks/useQueries';
import { toast } from 'sonner';

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateItemDialog({ open, onOpenChange }: CreateItemDialogProps) {
  const [itemType, setItemType] = useState<VaultItemType>('login');

  const createLoginMutation = useCreateLogin();
  const createCreditCardMutation = useCreateCreditCard();
  const createSecureNoteMutation = useCreateSecureNote();
  const createIdentityMutation = useCreateIdentity();

  const isLoading =
    createLoginMutation.isPending ||
    createCreditCardMutation.isPending ||
    createSecureNoteMutation.isPending ||
    createIdentityMutation.isPending;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      if (itemType === 'login') {
        const url = formData.get('login-url') as string;
        const notes = formData.get('login-notes') as string;
        await createLoginMutation.mutateAsync({
          username: formData.get('login-username') as string,
          password: formData.get('login-password') as string,
          url: url || undefined,
          notes: notes || undefined,
        });
        toast.success('Login created successfully');
      } else if (itemType === 'card') {
        const month = formData.get('card-month') as string;
        const year = formData.get('card-year') as string;
        await createCreditCardMutation.mutateAsync({
          cardholderName: formData.get('card-holder') as string,
          cardNumber: formData.get('card-number') as string,
          expiryDate: `${month}/${year}`,
          cvv: formData.get('card-cvv') as string,
          billingAddress: undefined,
        });
        toast.success('Credit card created successfully');
      } else if (itemType === 'note') {
        await createSecureNoteMutation.mutateAsync({
          title: formData.get('note-title') as string,
          content: formData.get('note-content') as string,
        });
        toast.success('Secure note created successfully');
      } else if (itemType === 'identity') {
        const email = formData.get('identity-email') as string;
        const phone = formData.get('identity-phone') as string;
        const address = formData.get('identity-address') as string;
        const firstName = formData.get('identity-first') as string;
        const lastName = formData.get('identity-last') as string;
        const name = `${firstName} ${lastName}`.trim() || (formData.get('identity-name') as string);
        
        await createIdentityMutation.mutateAsync({
          name,
          email: email || '',
          phone: phone || undefined,
          address: address || undefined,
        });
        toast.success('Identity created successfully');
      }

      onOpenChange(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create item');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Create a new item in your vault</DialogDescription>
        </DialogHeader>

        <Tabs value={itemType} onValueChange={(v) => setItemType(v as VaultItemType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="login" className="gap-2">
              <Lock className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="card" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="note" className="gap-2">
              <FileText className="h-4 w-4" />
              Note
            </TabsTrigger>
            <TabsTrigger value="identity" className="gap-2">
              <User className="h-4 w-4" />
              Identity
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-url">URL</Label>
                <Input
                  id="login-url"
                  name="login-url"
                  type="url"
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  name="login-username"
                  placeholder="username or email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  name="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-notes">Notes</Label>
                <Textarea
                  id="login-notes"
                  name="login-notes"
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-holder">Cardholder Name</Label>
                <Input
                  id="card-holder"
                  name="card-holder"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  name="card-number"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-month">Expiry Month</Label>
                  <Input
                    id="card-month"
                    name="card-month"
                    placeholder="MM"
                    maxLength={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-year">Expiry Year</Label>
                  <Input
                    id="card-year"
                    name="card-year"
                    placeholder="YYYY"
                    maxLength={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input
                    id="card-cvv"
                    name="card-cvv"
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="note" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note-title">Title</Label>
                <Input id="note-title" name="note-title" placeholder="e.g., API Keys" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  name="note-content"
                  placeholder="Your secure note content..."
                  rows={8}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="identity" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identity-name">Identity Name</Label>
                <Input
                  id="identity-name"
                  name="identity-name"
                  placeholder="e.g., Personal Identity"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identity-first">First Name</Label>
                  <Input id="identity-first" name="identity-first" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identity-last">Last Name</Label>
                  <Input id="identity-last" name="identity-last" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="identity-email">Email</Label>
                <Input
                  id="identity-email"
                  name="identity-email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identity-phone">Phone</Label>
                <Input
                  id="identity-phone"
                  name="identity-phone"
                  type="tel"
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identity-address">Address</Label>
                <Textarea
                  id="identity-address"
                  name="identity-address"
                  placeholder="Street address..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Item
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
