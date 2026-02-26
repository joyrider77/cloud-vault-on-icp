import { useState, useEffect } from 'react';
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
import { Lock, CreditCard, FileText, User } from 'lucide-react';
import type { VaultItem, VaultItemType } from '../pages/VaultPage';
import { toast } from 'sonner';
import { useUpdateLogin, useUpdateCreditCard, useUpdateSecureNote, useUpdateIdentity } from '../hooks/useQueries';

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: VaultItem | null;
}

export default function EditItemDialog({ open, onOpenChange, item }: EditItemDialogProps) {
  const [itemType, setItemType] = useState<VaultItemType>('login');
  
  // Form states for login
  const [loginName, setLoginName] = useState('');
  const [loginUrl, setLoginUrl] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginNotes, setLoginNotes] = useState('');
  const [loginTags, setLoginTags] = useState('');

  // Form states for card
  const [cardName, setCardName] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardMonth, setCardMonth] = useState('');
  const [cardYear, setCardYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form states for note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Form states for identity
  const [identityName, setIdentityName] = useState('');
  const [identityFirst, setIdentityFirst] = useState('');
  const [identityLast, setIdentityLast] = useState('');
  const [identityEmail, setIdentityEmail] = useState('');
  const [identityPhone, setIdentityPhone] = useState('');
  const [identityAddress, setIdentityAddress] = useState('');

  const updateLoginMutation = useUpdateLogin();
  const updateCreditCardMutation = useUpdateCreditCard();
  const updateSecureNoteMutation = useUpdateSecureNote();
  const updateIdentityMutation = useUpdateIdentity();

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setItemType(item.type);
      
      if (item.type === 'login') {
        setLoginName(item.title);
        setLoginUrl(item.data.url || '');
        setLoginUsername(item.data.username || '');
        setLoginPassword(item.data.password || '');
        setLoginNotes(item.data.notes || '');
        setLoginTags(item.data.tags ? item.data.tags.join(', ') : '');
      } else if (item.type === 'card') {
        setCardName(item.title);
        setCardHolder(item.data.cardholderName || '');
        setCardNumber(item.data.cardNumber || '');
        setCardMonth(item.data.expiryMonth || '');
        setCardYear(item.data.expiryYear || '');
        setCardCvv(item.data.cvv || '');
      } else if (item.type === 'note') {
        setNoteTitle(item.title);
        setNoteContent(item.data.content || '');
      } else if (item.type === 'identity') {
        setIdentityName(item.title);
        setIdentityFirst(item.data.firstName || '');
        setIdentityLast(item.data.lastName || '');
        setIdentityEmail(item.data.email || '');
        setIdentityPhone(item.data.phone || '');
        setIdentityAddress(item.data.address || '');
      }
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item) return;

    try {
      if (itemType === 'login') {
        await updateLoginMutation.mutateAsync({
          id: BigInt(item.id),
          login: {
            username: loginUsername,
            password: loginPassword,
            url: loginUrl || undefined,
            notes: loginNotes || undefined,
          },
        });
        toast.success('Login updated successfully');
      } else if (itemType === 'card') {
        await updateCreditCardMutation.mutateAsync({
          id: BigInt(item.id),
          card: {
            cardholderName: cardHolder,
            cardNumber: cardNumber,
            expiryDate: `${cardMonth}/${cardYear}`,
            cvv: cardCvv,
            billingAddress: undefined,
          },
        });
        toast.success('Card updated successfully');
      } else if (itemType === 'note') {
        await updateSecureNoteMutation.mutateAsync({
          id: BigInt(item.id),
          note: {
            title: noteTitle,
            content: noteContent,
          },
        });
        toast.success('Note updated successfully');
      } else if (itemType === 'identity') {
        await updateIdentityMutation.mutateAsync({
          id: BigInt(item.id),
          identity: {
            name: `${identityFirst} ${identityLast}`.trim(),
            email: identityEmail,
            phone: identityPhone || undefined,
            address: identityAddress || undefined,
          },
        });
        toast.success('Identity updated successfully');
      }
      
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update item');
      console.error('Update error:', error);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Update the details of your vault item</DialogDescription>
        </DialogHeader>

        <Tabs value={itemType} onValueChange={(v) => setItemType(v as VaultItemType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="login" className="gap-2" disabled={item.type !== 'login'}>
              <Lock className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="card" className="gap-2" disabled={item.type !== 'card'}>
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="note" className="gap-2" disabled={item.type !== 'note'}>
              <FileText className="h-4 w-4" />
              Note
            </TabsTrigger>
            <TabsTrigger value="identity" className="gap-2" disabled={item.type !== 'identity'}>
              <User className="h-4 w-4" />
              Identity
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-login-name">Name</Label>
                <Input
                  id="edit-login-name"
                  placeholder="e.g., GitHub"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-login-url">URL</Label>
                <Input
                  id="edit-login-url"
                  type="url"
                  placeholder="https://example.com"
                  value={loginUrl}
                  onChange={(e) => setLoginUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-login-username">Username</Label>
                <Input
                  id="edit-login-username"
                  placeholder="username or email"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-login-password">Password</Label>
                <Input
                  id="edit-login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-login-notes">Notes</Label>
                <Textarea
                  id="edit-login-notes"
                  placeholder="Additional notes..."
                  rows={3}
                  value={loginNotes}
                  onChange={(e) => setLoginNotes(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-login-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-login-tags"
                  placeholder="work, personal, etc."
                  value={loginTags}
                  onChange={(e) => setLoginTags(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-card-name">Card Name</Label>
                <Input
                  id="edit-card-name"
                  placeholder="e.g., Visa Card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-card-holder">Cardholder Name</Label>
                <Input
                  id="edit-card-holder"
                  placeholder="John Doe"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-card-number">Card Number</Label>
                <Input
                  id="edit-card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-card-month">Expiry Month</Label>
                  <Input
                    id="edit-card-month"
                    placeholder="MM"
                    maxLength={2}
                    value={cardMonth}
                    onChange={(e) => setCardMonth(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-card-year">Expiry Year</Label>
                  <Input
                    id="edit-card-year"
                    placeholder="YYYY"
                    maxLength={4}
                    value={cardYear}
                    onChange={(e) => setCardYear(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-card-cvv">CVV</Label>
                  <Input
                    id="edit-card-cvv"
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="note" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-note-title">Title</Label>
                <Input
                  id="edit-note-title"
                  placeholder="e.g., API Keys"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-content">Content</Label>
                <Textarea
                  id="edit-note-content"
                  placeholder="Your secure note content..."
                  rows={8}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="identity" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-identity-name">Identity Name</Label>
                <Input
                  id="edit-identity-name"
                  placeholder="e.g., Personal Identity"
                  value={identityName}
                  onChange={(e) => setIdentityName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-identity-first">First Name</Label>
                  <Input
                    id="edit-identity-first"
                    placeholder="John"
                    value={identityFirst}
                    onChange={(e) => setIdentityFirst(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-identity-last">Last Name</Label>
                  <Input
                    id="edit-identity-last"
                    placeholder="Doe"
                    value={identityLast}
                    onChange={(e) => setIdentityLast(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-identity-email">Email</Label>
                <Input
                  id="edit-identity-email"
                  type="email"
                  placeholder="john@example.com"
                  value={identityEmail}
                  onChange={(e) => setIdentityEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-identity-phone">Phone</Label>
                <Input
                  id="edit-identity-phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={identityPhone}
                  onChange={(e) => setIdentityPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-identity-address">Address</Label>
                <Textarea
                  id="edit-identity-address"
                  placeholder="Street address..."
                  rows={3}
                  value={identityAddress}
                  onChange={(e) => setIdentityAddress(e.target.value)}
                />
              </div>
            </TabsContent>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updateLoginMutation.isPending ||
                  updateCreditCardMutation.isPending ||
                  updateSecureNoteMutation.isPending ||
                  updateIdentityMutation.isPending
                }
              >
                {updateLoginMutation.isPending ||
                updateCreditCardMutation.isPending ||
                updateSecureNoteMutation.isPending ||
                updateIdentityMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
