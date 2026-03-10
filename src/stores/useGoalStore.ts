import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Goal, GoalMilestone } from '../types';

interface GoalState {
    goals: Goal[];

    // CRUD
    addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'isCompleted' | 'createdAt' | 'milestones'>) => string;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;

    // Actions
    addMoneyToGoal: (id: string, amount: number) => void;
    withdrawFromGoal: (id: string, amount: number) => void;

    // Queries
    getGoalById: (id: string) => Goal | undefined;
    getActiveGoals: () => Goal[];
    getCompletedGoals: () => Goal[];
    getGoalProgress: (id: string) => {
        current: number;
        target: number;
        percentage: number;
        remaining: number;
        isCompleted: boolean;
    };
    getTotalSaved: () => number;
}

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const createDefaultMilestones = (goalId: string): GoalMilestone[] => {
    return [
        { id: `${goalId}_m25`, percentage: 25, title: '25% reached!', isReached: false },
        { id: `${goalId}_m50`, percentage: 50, title: 'Halfway there!', isReached: false },
        { id: `${goalId}_m75`, percentage: 75, title: '75% done!', isReached: false },
        { id: `${goalId}_m100`, percentage: 100, title: 'Goal completed! 🎉', isReached: false },
    ];
};

const checkMilestones = (
    milestones: GoalMilestone[],
    percentage: number
): GoalMilestone[] => {
    return milestones.map((m) => {
        if (!m.isReached && percentage >= m.percentage) {
            return { ...m, isReached: true, reachedAt: new Date().toISOString() };
        }
        return m;
    });
};

export const useGoalStore = create<GoalState>()(
    persist(
        (set, get) => ({
            goals: [],

            addGoal: (goalData) => {
                const id = generateId();
                const goal: Goal = {
                    ...goalData,
                    id,
                    currentAmount: 0,
                    isCompleted: false,
                    milestones: createDefaultMilestones(id),
                    createdAt: new Date().toISOString(),
                };

                set((state) => ({
                    goals: [...state.goals, goal],
                }));

                return id;
            },

            updateGoal: (id, updates) => {
                set((state) => ({
                    goals: state.goals.map((g) =>
                        g.id === id ? { ...g, ...updates } : g
                    ),
                }));
            },

            deleteGoal: (id) => {
                set((state) => ({
                    goals: state.goals.filter((g) => g.id !== id),
                }));
            },

            addMoneyToGoal: (id, amount) => {
                set((state) => ({
                    goals: state.goals.map((g) => {
                        if (g.id !== id) return g;

                        const newAmount = g.currentAmount + amount;
                        const percentage = (newAmount / g.targetAmount) * 100;
                        const updatedMilestones = checkMilestones(g.milestones, percentage);
                        const isCompleted = newAmount >= g.targetAmount;

                        return {
                            ...g,
                            currentAmount: newAmount,
                            milestones: updatedMilestones,
                            isCompleted,
                        };
                    }),
                }));
            },

            withdrawFromGoal: (id, amount) => {
                set((state) => ({
                    goals: state.goals.map((g) => {
                        if (g.id !== id) return g;

                        const newAmount = Math.max(g.currentAmount - amount, 0);

                        return {
                            ...g,
                            currentAmount: newAmount,
                            isCompleted: false,
                        };
                    }),
                }));
            },

            getGoalById: (id) => {
                return get().goals.find((g) => g.id === id);
            },

            getActiveGoals: () => {
                return get().goals.filter((g) => !g.isCompleted);
            },

            getCompletedGoals: () => {
                return get().goals.filter((g) => g.isCompleted);
            },

            getGoalProgress: (id) => {
                const goal = get().goals.find((g) => g.id === id);
                if (!goal) {
                    return {
                        current: 0,
                        target: 0,
                        percentage: 0,
                        remaining: 0,
                        isCompleted: false,
                    };
                }

                const percentage =
                    goal.targetAmount > 0
                        ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                        : 0;

                return {
                    current: goal.currentAmount,
                    target: goal.targetAmount,
                    percentage,
                    remaining: Math.max(goal.targetAmount - goal.currentAmount, 0),
                    isCompleted: goal.isCompleted,
                };
            },

            getTotalSaved: () => {
                return get().goals.reduce((sum, g) => sum + g.currentAmount, 0);
            },
        }),
        {
            name: 'budget-app-goals',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                goals: state.goals,
            }),
        }
    )
);