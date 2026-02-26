import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Login, CreditCard, SecureNote, Identity, ItemId, VaultData } from '../backend';

const EMPTY_VAULT: VaultData = {
  logins: [],
  creditCards: [],
  secureNotes: [],
  identities: [],
};

// Query hook to fetch all vault data
export function useVaultQuery() {
  const { actor, isFetching } = useActor();

  return useQuery<VaultData>({
    queryKey: ['vault'],
    queryFn: async () => {
      if (!actor) return EMPTY_VAULT;
      try {
        return await actor.getAllVaultItems();
      } catch {
        // If no items found (e.g. new user), return empty vault
        return EMPTY_VAULT;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Create mutations
export function useCreateLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (login: Login) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createLogin(login);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useCreateCreditCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (card: CreditCard) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createCreditCard(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useCreateSecureNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: SecureNote) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createSecureNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useCreateIdentity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identity: Identity) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createIdentity(identity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

// Update mutations
export function useUpdateLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, login }: { id: ItemId; login: Login }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateLogin(id, login);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useUpdateCreditCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, card }: { id: ItemId; card: CreditCard }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateCreditCard(id, card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useUpdateSecureNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, note }: { id: ItemId; note: SecureNote }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateSecureNote(id, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useUpdateIdentity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, identity }: { id: ItemId; identity: Identity }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateIdentity(id, identity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

// Delete mutations
export function useDeleteLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ItemId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteLogin(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useDeleteCreditCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ItemId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteCreditCard(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useDeleteSecureNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ItemId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteSecureNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}

export function useDeleteIdentity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ItemId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteIdentity(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}
