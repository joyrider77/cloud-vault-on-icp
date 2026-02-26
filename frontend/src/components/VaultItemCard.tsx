import { Lock, CreditCard, FileText, User, Star, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { VaultItem } from '../pages/VaultPage';

interface VaultItemCardProps {
  item: VaultItem;
  onClick: () => void;
  onEdit: (item: VaultItem) => void;
  onDelete: (item: VaultItem) => void;
}

export default function VaultItemCard({ item, onClick, onEdit, onDelete }: VaultItemCardProps) {
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

  const getTypeLabel = () => {
    switch (item.type) {
      case 'login':
        return 'Login';
      case 'card':
        return 'Card';
      case 'note':
        return 'Note';
      case 'identity':
        return 'Identity';
    }
  };

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{item.title}</h3>
                {item.isFavorite && (
                  <Star className="h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />
                )}
              </div>
              {item.subtitle && (
                <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {getTypeLabel()}
                </Badge>
                {item.type === 'login' && item.data.tags && item.data.tags.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {item.data.tags[0]}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick(); }}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                {item.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(item); }} 
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
