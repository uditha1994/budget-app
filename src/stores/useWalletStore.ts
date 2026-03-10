import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Wallet } from '../types';

interface WalletState {
    wallets: Wallet[];

    // Actions
    addWallet: (wallet: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateWallet: (id: string, updates: Partial<Wallet>) => void;
    deleteWallet: (id: string) => void;
    updateBalance: (id: string, amount: number) => void;
    getWalletById: (id: string) => Wallet | undefined;
    getDefaultWallet: () => Wallet | undefined;
    getTotalBalance: () => number;
    setDefaultWallet: (id: string) => void;
}

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export const useWalletStore = create<WalletState>()(
    persist(
        (set, get) => ({
            wallets: [],

            addWallet: (walletData) => {
                const id = generateId();
                const now = new Date().toISOString();
                const wallet: Wallet = {
                    ...walletData,
                    id,
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    wallets: [...state.wallets, wallet],
                }));

                return id;
            },

            updateWallet: (id, updates) => {
                set((state) => ({
                    wallets: state.wallets.map((w) =>
                        w.id === id
                            ? { ...w, ...updates, updatedAt: new Date().toISOString() }
                            : w
                    ),
                }));
            },

            deleteWallet: (id) => {
                set((state) => ({
                    wallets: state.wallets.filter((w) => w.id !== id),
                }));
            },

            updateBalance: (id, amount) => {
                set((state) => ({
                    wallets: state.wallets.map((w) =>
                        w.id === id
                            ? {
                                ...w,
                                currentBalance: w.currentBalance + amount,
                                updatedAt: new Date().toISOString(),
                            }
                            : w
                    ),
                }));
            },

            getWalletById: (id) => {
                return get().wallets.find((w) => w.id === id);
            },

            getDefaultWallet: () => {
                const wallets = get().wallets;
                return wallets.find((w) => w.isDefault) || wallets[0];
            },

            getTotalBalance: () => {
                return get().wallets.reduce((sum, w) => sum + w.currentBalance, 0);
            },

            setDefaultWallet: (id) => {
                set((state) => ({
                    wallets: state.wallets.map((w) => ({
                        ...w,
                        isDefault: w.id === id,
                        updatedAt: w.id === id ? new Date().toISOString() : w.updatedAt,
                    })),
                }));
            },
        }),
        {
            name: 'budget-app-wallets',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                wallets: state.wallets,
            }),
        }
    )
);