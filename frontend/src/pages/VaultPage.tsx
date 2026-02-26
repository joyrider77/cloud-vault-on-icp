import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Lock, CreditCard, FileText, User, Star, Loader2 } from 'lucide-react';
import VaultItemCard from '../components/VaultItemCard';
import CreateItemDialog from '../components/CreateItemDialog';
import ItemDetailDialog from '../components/ItemDetailDialog';
import EditItemDialog from '../components/EditItemDialog';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import PasswordGeneratorDialog from '../components/PasswordGeneratorDialog';
import { Badge } from '@/components/ui/badge';
import {
  useVaultQuery,
  useDeleteLogin,
  useDeleteCreditCard,
  useDeleteSecureNote,
  useDeleteIdentity,
} from '../hooks/useQueries';
import { toast } from 'sonner';

export type VaultItemType = 'login' | 'card' | 'note' | 'identity';

export interface VaultItem {
  id: string;
  type: VaultItemType;
  title: string;
  subtitle?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  data: any;
}

export default function VaultPage() {
  const navigate = useNavigate();
  const { identity, isLoginSuccess } = useInternetIdentity();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<VaultItemType | 'all' | 'favorites'>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [editItem, setEditItem] = useState<VaultItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<VaultItem | null>(null);
  const [passwordGenOpen, setPasswordGenOpen] = useState(false);

  const { data: vaultData, isLoading } = useVaultQuery();
  const deleteLoginMutation = useDeleteLogin();
  const deleteCreditCardMutation = useDeleteCreditCard();
  const deleteSecureNoteMutation = useDeleteSecureNote();
  const deleteIdentityMutation = useDeleteIdentity();

  useEffect(() => {
    if (!isLoginSuccess || !identity) {
      navigate({ to: '/' });
    }
  }, [isLoginSuccess, identity, navigate]);

  // Convert backend data to VaultItem format
  const vaultItems: VaultItem[] = [];

  if (vaultData) {
    // Add logins
    vaultData.logins.forEach(([id, login]) => {
      vaultItems.push({
        id: id.toString(),
        type: 'login',
        title: login.url || login.username,
        subtitle: login.url ? login.username : undefined,
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: login,
      });
    });

    // Add credit cards
    vaultData.creditCards.forEach(([id, card]) => {
      const lastFour = card.cardNumber.slice(-4);
      vaultItems.push({
        id: id.toString(),
        type: 'card',
        title: card.cardholderName,
        subtitle: `•••• ${lastFour}`,
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: card,
      });
    });

    // Add secure notes
    vaultData.secureNotes.forEach(([id, note]) => {
      vaultItems.push({
        id: id.toString(),
        type: 'note',
        title: note.title,
        subtitle: note.content.substring(0, 50) + (note.content.length > 50 ? '...' : ''),
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: note,
      });
    });

    // Add identities
    vaultData.identities.forEach(([id, identityData]) => {
      vaultItems.push({
        id: id.toString(),
        type: 'identity',
        title: identityData.name,
        subtitle: identityData.email,
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: identityData,
      });
    });
  }

  const filteredItems = vaultItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'favorites') return matchesSearch && item.isFavorite;
    return matchesSearch && item.type === activeTab;
  });

  const getItemCount = (type: VaultItemType | 'all' | 'favorites') => {
    if (type === 'all') return vaultItems.length;
    if (type === 'favorites') return vaultItems.filter((i) => i.isFavorite).length;
    return vaultItems.filter((i) => i.type === type).length;
  };

  const handleEdit = (item: VaultItem) => {
    setEditItem(item);
    setSelectedItem(null);
  };

  const handleDelete = (item: VaultItem) => {
    setDeleteItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    try {
      const itemId = BigInt(deleteItem.id);

      if (deleteItem.type === 'login') {
        await deleteLoginMutation.mutateAsync(itemId);
      } else if (deleteItem.type === 'card') {
        await deleteCreditCardMutation.mutateAsync(itemId);
      } else if (deleteItem.type === 'note') {
        await deleteSecureNoteMutation.mutateAsync(itemId);
      } else if (deleteItem.type === 'identity') {
        await deleteIdentityMutation.mutateAsync(itemId);
      }

      toast.success('Item deleted successfully');
      setSelectedItem(null);
      setDeleteItem(null);
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Delete error:', error);
    }
  };

  const getTypeLabel = (type: VaultItemType) => {
    switch (type) {
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

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Vault</h1>
            <p className="text-muted-foreground">
              Manage your passwords, cards, notes, and identities
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setPasswordGenOpen(true)} variant="outline">
              <Lock className="mr-2 h-4 w-4" />
              Generate Password
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="ml-1">
                {getItemCount('all')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Star className="h-4 w-4" />
              Favorites
              <Badge variant="secondary" className="ml-1">
                {getItemCount('favorites')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="login" className="gap-2">
              <Lock className="h-4 w-4" />
              Logins
              <Badge variant="secondary" className="ml-1">
                {getItemCount('login')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="card" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Cards
              <Badge variant="secondary" className="ml-1">
                {getItemCount('card')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="note" className="gap-2">
              <FileText className="h-4 w-4" />
              Notes
              <Badge variant="secondary" className="ml-1">
                {getItemCount('note')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="identity" className="gap-2">
              <User className="h-4 w-4" />
              Identities
              <Badge variant="secondary" className="ml-1">
                {getItemCount('identity')}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  {activeTab === 'login' && <Lock className="h-12 w-12 text-muted-foreground" />}
                  {activeTab === 'card' && (
                    <CreditCard className="h-12 w-12 text-muted-foreground" />
                  )}
                  {activeTab === 'note' && <FileText className="h-12 w-12 text-muted-foreground" />}
                  {activeTab === 'identity' && <User className="h-12 w-12 text-muted-foreground" />}
                  {activeTab === 'favorites' && <Star className="h-12 w-12 text-muted-foreground" />}
                  {activeTab === 'all' && <Lock className="h-12 w-12 text-muted-foreground" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : `You don't have any ${activeTab === 'all' ? 'items' : activeTab === 'favorites' ? 'favorite items' : getTypeLabel(activeTab as VaultItemType).toLowerCase() + 's'} yet`}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Item
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <VaultItemCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateItemDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ItemDetailDialog
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditItemDialog
        item={editItem}
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      />
      <ConfirmDeleteDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.title || ''}
        itemType={deleteItem?.type || 'login'}
      />
      <PasswordGeneratorDialog open={passwordGenOpen} onOpenChange={setPasswordGenOpen} />
    </div>
  );
}
