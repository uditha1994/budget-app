import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Transaction, TransactionType } from '../types';

interface TransactionFilters {
    type?: TransactionType;
    categoryId?: string;
    walletId?: string;
    startDate?: string;
    endDate?: string;
    searchQuery?: string;
}

interface TransactionState {
    transactions: Transaction[];

    // CRUD
    addTransaction: (
        transaction: Omit<Transaction, 'id' | 'createdAt'>
    ) => string;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;

    // Queries
    getTransactionById: (id: string) => Transaction | undefined;
    getFilteredTransactions: (filters: TransactionFilters) => Transaction[];
    getTransactionsByDate: (date: string) => Transaction[];
    getTransactionsByMonth: (year: number, month: number) => Transaction[];
    getTransactionsByWallet: (walletId: string) => Transaction[];
    getRecentTransactions: (limit?: number) => Transaction[];

    // Aggregations
    getTotalByType: (
        type: TransactionType,
        year: number,
        month: number
    ) => number;
    getTodayTotal: (type: TransactionType) => number;
    getCategoryTotal: (
        categoryId: string,
        year: number,
        month: number
    ) => number;
    getMonthlyTotals: (
        year: number,
        month: number
    ) => { income: number; expense: number; net: number };
    getDailyTotals: (
        year: number,
        month: number
    ) => Array<{ date: string; income: number; expense: number }>;
}

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const isSameDay = (date1: string, date2: string): boolean => {
    return date1.substring(0, 10) === date2.substring(0, 10);
};

const isInMonth = (date: string, year: number, month: number): boolean => {
    const d = new Date(date);
    return d.getFullYear() === year && d.getMonth() === month;
};

export const useTransactionStore = create<TransactionState>()(
    persist(
        (set, get) => ({
            transactions: [],

            // ---- CRUD ----

            addTransaction: (transactionData) => {
                const id = generateId();
                const transaction: Transaction = {
                    ...transactionData,
                    id,
                    createdAt: new Date().toISOString(),
                };

                set((state) => ({
                    transactions: [transaction, ...state.transactions],
                }));

                return id;
            },

            updateTransaction: (id, updates) => {
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === id ? { ...t, ...updates } : t
                    ),
                }));
            },

            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },

            // ---- QUERIES ----

            getTransactionById: (id) => {
                return get().transactions.find((t) => t.id === id);
            },

            getFilteredTransactions: (filters) => {
                let result = [...get().transactions];

                if (filters.type) {
                    result = result.filter((t) => t.type === filters.type);
                }

                if (filters.categoryId) {
                    result = result.filter((t) => t.categoryId === filters.categoryId);
                }

                if (filters.walletId) {
                    result = result.filter(
                        (t) =>
                            t.walletId === filters.walletId ||
                            t.toWalletId === filters.walletId
                    );
                }

                if (filters.startDate) {
                    result = result.filter((t) => t.date >= filters.startDate!);
                }

                if (filters.endDate) {
                    result = result.filter((t) => t.date <= filters.endDate!);
                }

                if (filters.searchQuery) {
                    const query = filters.searchQuery.toLowerCase();
                    result = result.filter(
                        (t) =>
                            t.note.toLowerCase().includes(query) ||
                            t.tags.some((tag) => tag.toLowerCase().includes(query))
                    );
                }

                // Sort by date descending
                return result.sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            },

            getTransactionsByDate: (date) => {
                return get()
                    .transactions.filter((t) => isSameDay(t.date, date))
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
            },

            getTransactionsByMonth: (year, month) => {
                return get()
                    .transactions.filter((t) => isInMonth(t.date, year, month))
                    .sort(
                        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
            },

            getTransactionsByWallet: (walletId) => {
                return get()
                    .transactions.filter(
                        (t) => t.walletId === walletId || t.toWalletId === walletId
                    )
                    .sort(
                        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
            },

            getRecentTransactions: (limit = 10) => {
                return [...get().transactions]
                    .sort(
                        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .slice(0, limit);
            },

            // ---- AGGREGATIONS ----

            getTotalByType: (type, year, month) => {
                return get()
                    .transactions.filter(
                        (t) => t.type === type && isInMonth(t.date, year, month)
                    )
                    .reduce((sum, t) => sum + t.amount, 0);
            },

            getTodayTotal: (type) => {
                const today = new Date().toISOString().substring(0, 10);
                return get()
                    .transactions.filter(
                        (t) => t.type === type && t.date.substring(0, 10) === today
                    )
                    .reduce((sum, t) => sum + t.amount, 0);
            },

            getCategoryTotal: (categoryId, year, month) => {
                return get()
                    .transactions.filter(
                        (t) =>
                            t.categoryId === categoryId && isInMonth(t.date, year, month)
                    )
                    .reduce((sum, t) => sum + t.amount, 0);
            },

            getMonthlyTotals: (year, month) => {
                const monthTransactions = get().transactions.filter((t) =>
                    isInMonth(t.date, year, month)
                );

                const income = monthTransactions
                    .filter((t) => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);

                const expense = monthTransactions
                    .filter((t) => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);

                return { income, expense, net: income - expense };
            },

            getDailyTotals: (year, month) => {
                const monthTransactions = get().transactions.filter((t) =>
                    isInMonth(t.date, year, month)
                );

                const dailyMap: Record<
                    string,
                    { income: number; expense: number }
                > = {};

                monthTransactions.forEach((t) => {
                    const dateKey = t.date.substring(0, 10);
                    if (!dailyMap[dateKey]) {
                        dailyMap[dateKey] = { income: 0, expense: 0 };
                    }
                    if (t.type === 'income') {
                        dailyMap[dateKey].income += t.amount;
                    } else if (t.type === 'expense') {
                        dailyMap[dateKey].expense += t.amount;
                    }
                });

                return Object.entries(dailyMap)
                    .map(([date, totals]) => ({ date, ...totals }))
                    .sort((a, b) => a.date.localeCompare(b.date));
            },
        }),
        {
            name: 'budget-app-transactions',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                transactions: state.transactions,
            }),
        }
    )
);