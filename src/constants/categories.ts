import { Category } from '../types';

export const defaultCategories: Category[] = [
    // Expense Categories
    {
        id: 'food',
        name: 'Food & Dining',
        nameKey: 'categories.food',
        icon: 'restaurant',
        color: '#F97316',
        type: 'expense',
        isCustom: false,
        sortOrder: 1,
    },
    {
        id: 'transport',
        name: 'Transport',
        nameKey: 'categories.transport',
        icon: 'car',
        color: '#3B82F6',
        type: 'expense',
        isCustom: false,
        sortOrder: 2,
    },
    {
        id: 'shopping',
        name: 'Shopping',
        nameKey: 'categories.shopping',
        icon: 'cart',
        color: '#A855F7',
        type: 'expense',
        isCustom: false,
        sortOrder: 3,
    },
    {
        id: 'bills',
        name: 'Bills & Utilities',
        nameKey: 'categories.bills',
        icon: 'flash',
        color: '#EAB308',
        type: 'expense',
        isCustom: false,
        sortOrder: 4,
    },
    {
        id: 'entertainment',
        name: 'Entertainment',
        nameKey: 'categories.entertainment',
        icon: 'game-controller',
        color: '#EC4899',
        type: 'expense',
        isCustom: false,
        sortOrder: 5,
    },
    {
        id: 'health',
        name: 'Health & Fitness',
        nameKey: 'categories.health',
        icon: 'fitness',
        color: '#22C55E',
        type: 'expense',
        isCustom: false,
        sortOrder: 6,
    },
    {
        id: 'education',
        name: 'Education',
        nameKey: 'categories.education',
        icon: 'school',
        color: '#6366F1',
        type: 'expense',
        isCustom: false,
        sortOrder: 7,
    },
    {
        id: 'personal',
        name: 'Personal Care',
        nameKey: 'categories.personal',
        icon: 'person',
        color: '#F43F5E',
        type: 'expense',
        isCustom: false,
        sortOrder: 8,
    },
    {
        id: 'housing',
        name: 'Housing & Rent',
        nameKey: 'categories.housing',
        icon: 'home',
        color: '#14B8A6',
        type: 'expense',
        isCustom: false,
        sortOrder: 9,
    },
    {
        id: 'gifts',
        name: 'Gifts & Donations',
        nameKey: 'categories.gifts',
        icon: 'gift',
        color: '#8B5CF6',
        type: 'expense',
        isCustom: false,
        sortOrder: 10,
    },
    {
        id: 'subscriptions',
        name: 'Subscriptions',
        nameKey: 'categories.subscriptions',
        icon: 'card',
        color: '#06B6D4',
        type: 'expense',
        isCustom: false,
        sortOrder: 11,
    },
    {
        id: 'other_expense',
        name: 'Other',
        nameKey: 'categories.other',
        icon: 'ellipsis-horizontal',
        color: '#78716C',
        type: 'expense',
        isCustom: false,
        sortOrder: 12,
    },

    // Income Categories
    {
        id: 'salary',
        name: 'Salary',
        nameKey: 'categories.salary',
        icon: 'briefcase',
        color: '#22C55E',
        type: 'income',
        isCustom: false,
        sortOrder: 1,
    },
    {
        id: 'freelance',
        name: 'Freelance',
        nameKey: 'categories.freelance',
        icon: 'laptop',
        color: '#3B82F6',
        type: 'income',
        isCustom: false,
        sortOrder: 2,
    },
    {
        id: 'investment',
        name: 'Investment',
        nameKey: 'categories.investment',
        icon: 'trending-up',
        color: '#A855F7',
        type: 'income',
        isCustom: false,
        sortOrder: 3,
    },
    {
        id: 'other_income',
        name: 'Other Income',
        nameKey: 'categories.otherIncome',
        icon: 'cash',
        color: '#14B8A6',
        type: 'income',
        isCustom: false,
        sortOrder: 4,
    },
];

export const getCategoryById = (id: string): Category | undefined => {
    return defaultCategories.find(cat => cat.id === id);
};

export const getExpenseCategories = (): Category[] => {
    return defaultCategories.filter(cat => cat.type === 'expense');
};

export const getIncomeCategories = (): Category[] => {
    return defaultCategories.filter(cat => cat.type === 'income');
};