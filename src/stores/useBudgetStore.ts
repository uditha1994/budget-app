import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Budget } from '../types';

interface BudgetState {
    budgets: Budget[];

    // CRUD
    addBudget: (budget: Omit<Budget, 'id' | 'spentAmount' | 'createdAt'>) => string;
    updateBudget: (id: string, updates: Partial<Budget>) => void;
    deleteBudget: (id: string) => void;

    // Queries
    getBudgetById: (id: string) => Budget | undefined;
    getActiveBudgets: () => Budget[];
    getBudgetByCategory: (categoryId: string) => Budget | undefined;
    getBudgetProgress: (id: string) => {
        spent: number;
        planned: number;
        percentage: number;
        remaining: number;
        isOverBudget: boolean;
        isNearLimit: boolean;
    };

    // Update spending
    updateSpentAmount: (categoryId: string, amount: number) => void;
    resetMonthlyBudgets: () => void;
}

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set, get) => ({
            budgets: [],

            addBudget: (budgetData) => {
                const id = generateId();
                const budget: Budget = {
                    ...budgetData,
                    id,
                    spentAmount: 0,
                    createdAt: new Date().toISOString(),
                };

                set((state) => ({
                    budgets: [...state.budgets, budget],
                }));

                return id;
            },

            updateBudget: (id, updates) => {
                set((state) => ({
                    budgets: state.budgets.map((b) =>
                        b.id === id ? { ...b, ...updates } : b
                    ),
                }));
            },

            deleteBudget: (id) => {
                set((state) => ({
                    budgets: state.budgets.filter((b) => b.id !== id),
                }));
            },

            getBudgetById: (id) => {
                return get().budgets.find((b) => b.id === id);
            },

            getActiveBudgets: () => {
                return get().budgets.filter((b) => b.isActive);
            },

            getBudgetByCategory: (categoryId) => {
                return get().budgets.find(
                    (b) => b.categoryId === categoryId && b.isActive
                );
            },

            getBudgetProgress: (id) => {
                const budget = get().budgets.find((b) => b.id === id);
                if (!budget) {
                    return {
                        spent: 0,
                        planned: 0,
                        percentage: 0,
                        remaining: 0,
                        isOverBudget: false,
                        isNearLimit: false,
                    };
                }

                const percentage =
                    budget.plannedAmount > 0
                        ? (budget.spentAmount / budget.plannedAmount) * 100
                        : 0;

                return {
                    spent: budget.spentAmount,
                    planned: budget.plannedAmount,
                    percentage: Math.min(percentage, 100),
                    remaining: Math.max(budget.plannedAmount - budget.spentAmount, 0),
                    isOverBudget: budget.spentAmount > budget.plannedAmount,
                    isNearLimit: percentage >= budget.thresholdPercentage,
                };
            },

            updateSpentAmount: (categoryId, amount) => {
                set((state) => ({
                    budgets: state.budgets.map((b) =>
                        b.categoryId === categoryId && b.isActive
                            ? { ...b, spentAmount: b.spentAmount + amount }
                            : b
                    ),
                }));
            },

            resetMonthlyBudgets: () => {
                set((state) => ({
                    budgets: state.budgets.map((b) =>
                        b.cycle === 'monthly' ? { ...b, spentAmount: 0 } : b
                    ),
                }));
            },
        }),
        {
            name: 'budget-app-budgets',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                budgets: state.budgets,
            }),
        }
    )
);