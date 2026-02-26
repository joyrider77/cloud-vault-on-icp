import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ItemId = bigint;
export interface Identity {
    name: string;
    email: string;
    address?: string;
    phone?: string;
}
export interface CreditCard {
    cvv: string;
    billingAddress?: string;
    expiryDate: string;
    cardholderName: string;
    cardNumber: string;
}
export interface VaultData {
    creditCards: Array<[ItemId, CreditCard]>;
    logins: Array<[ItemId, Login]>;
    secureNotes: Array<[ItemId, SecureNote]>;
    identities: Array<[ItemId, Identity]>;
}
export interface SecureNote {
    title: string;
    content: string;
}
export interface Login {
    url?: string;
    username: string;
    password: string;
    notes?: string;
}
export interface backendInterface {
    createCreditCard(card: CreditCard): Promise<ItemId>;
    createIdentity(identity: Identity): Promise<ItemId>;
    createLogin(login: Login): Promise<ItemId>;
    createSecureNote(note: SecureNote): Promise<ItemId>;
    deleteCreditCard(id: ItemId): Promise<void>;
    deleteIdentity(id: ItemId): Promise<void>;
    deleteLogin(id: ItemId): Promise<void>;
    deleteSecureNote(id: ItemId): Promise<void>;
    getAllVaultItems(): Promise<VaultData>;
    getCreditCards(): Promise<Array<[ItemId, CreditCard]>>;
    getIdentities(): Promise<Array<[ItemId, Identity]>>;
    getLogins(): Promise<Array<[ItemId, Login]>>;
    getSecureNotes(): Promise<Array<[ItemId, SecureNote]>>;
    updateCreditCard(id: ItemId, updated: CreditCard): Promise<void>;
    updateIdentity(id: ItemId, updated: Identity): Promise<void>;
    updateLogin(id: ItemId, updated: Login): Promise<void>;
    updateSecureNote(id: ItemId, updated: SecureNote): Promise<void>;
}
