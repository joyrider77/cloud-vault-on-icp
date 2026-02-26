import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock, CreditCard, FileText, User, Eye, EyeOff, Copy, Star, Edit, Trash2 } from 'lucide-react';
import type { VaultItem } from '../pages/VaultPage';
import { toast } from 'sonner';

interface ItemDetailDialogProps {
  item: VaultItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: VaultItem) => void;
  onDelete: (item: VaultItem) => void;
}

export default function ItemDetailDialog({ item, open, onOpenChange, onEdit, onDelete }: ItemDetailDialogProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!item) return null;

  const getIcon = () => {
    switch (item.type) {
      case 'login':
        return Lock;
      case 'card':
        return CreditCard;
      case 'note':
        return FileText;
      case 'identity':
        return User;
    }
  };

  const Icon = getIcon();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied!`, { duration: 2000 });
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  };

  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = () => {
    onDelete(item);
  };

  const renderContent = () => {
    switch (item.type) {
      case 'login':
        return (
          <div className="space-y-4">
            {item.data.url && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">URL</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.data.url, 'URL')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm break-all">{item.data.url}</p>
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Username</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.data.username, 'Username')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm">{item.data.username}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Password</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.data.password, 'Password')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm font-mono">
                {showPassword ? item.data.password : '••••••••••••'}
              </p>
            </div>
            {item.data.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Notes</span>
                  <p className="text-sm whitespace-pre-wrap">{item.data.notes}</p>
                </div>
              </>
            )}
            {item.data.tags && item.data.tags.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {item.data.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Cardholder Name</span>
              <p className="text-sm">{item.data.cardholderName}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Card Number</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.data.cardNumber, 'Card number')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm font-mono">{item.data.cardNumber}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Expiry Date</span>
                <p className="text-sm">
                  {item.data.expiryMonth}/{item.data.expiryYear}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">CVV</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.data.cvv, 'CVV')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm font-mono">{item.data.cvv}</p>
              </div>
            </div>
          </div>
        );

      case 'note':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Content</span>
              <p className="text-sm whitespace-pre-wrap">{item.data.content}</p>
            </div>
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Name</span>
              <p className="text-sm">
                {item.data.firstName} {item.data.lastName}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.data.email, 'Email')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm">{item.data.email}</p>
            </div>
            {item.data.phone && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Phone</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.data.phone, 'Phone')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{item.data.phone}</p>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-2">
                {item.title}
                {item.isFavorite && (
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                )}
              </DialogTitle>
              {item.subtitle && (
                <DialogDescription>{item.subtitle}</DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">{renderContent()}</div>

        <div className="mt-6 flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
