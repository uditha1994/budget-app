// ============================================================
// CORE TYPE DEFINITIONS
// Budget Planning & Expense Tracking App
// ============================================================

// --- Language & Locale ---
export type Language = 'en' | 'si' | 'ta';

export type Currency = {
    code: string;
    symbol: string;
    name: string;
    locale: string;
};

// --- Theme ---
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePreset = 'orange' | 'calm' | 'neon' | 'minimal' | 'growth';

export interface ThemeColors {
    // Core
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;

    // Backgrounds
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    surface: string;
    surfaceElevated: string;

    // Text
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;

    // Semantic
    success: string;
    warning: string;
    error: string;
    info: string;

    // UI Elements
    border: string;
    borderLight: string;
    shadow: string;
    overlay: string;
    tabBar: string;
    tabBarInactive: string;

    // Glass effect
    glass: string;
    glassBorder: string;

    // Gradient pairs
    gradientPrimary: [string, string];
    gradientSecondary: [string, string];
    gradientSuccess: [string, string];
    gradientWarning: [string, string];
    gradientDanger: [string, string];

    // Income/Expense
    income: string;
    expense: string;
    transfer: string;
}

// --- User ---
export interface UserProfile {
    id: string;
    name: string;
    currency: Currency;
    language: Language;
    themeMode: ThemeMode;
    themePreset: ThemePreset;
    onboardingCompleted: boolean;
    createdAt: string;
}

// --- Wallet ---
export type WalletType = 'cash' | 'bank' | 'card' | 'ewallet' | 'savings';

export interface Wallet {
    id: string;
    name: string;
    type: WalletType;
    currentBalance: number;
    icon: string;
    color: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- Transaction ---
export type TransactionType = 'income' | 'expense' | 'transfer';

export type MoodTag = 'happy' | 'stressed' | 'social' | 'tired' | 'celebration' | 'impulsive' | 'planned' | 'neutral';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    walletId: string;
    toWalletId?: string; // for transfers
    note: string;
    tags: string[];
    mood?: MoodTag;
    date: string;
    receiptUri?: string;
    location?: string;
    isRecurring: boolean;
    recurringId?: string;
    createdAt: string;
}

// --- Category ---
export interface Category {
    id: string;
    name: string;
    nameKey: string; // i18n key
    icon: string;
    color: string;
    type: TransactionType;
    isCustom: boolean;
    parentId?: string;
    sortOrder: number;
}

// --- Budget ---
export type BudgetCycle = 'weekly' | 'monthly' | 'yearly' | 'event';

export interface Budget {
    id: string;
    categoryId: string;
    cycle: BudgetCycle;
    plannedAmount: number;
    spentAmount: number;
    startDate: string;
    endDate?: string;
    thresholdPercentage: number; // Alert at this % (e.g., 80)
    isActive: boolean;
    createdAt: string;
}

// --- Goal ---
export interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    dueDate?: string;
    icon: string;
    color: string;
    autoSaveAmount?: number;
    autoSaveFrequency?: 'daily' | 'weekly' | 'monthly';
    milestones: GoalMilestone[];
    isCompleted: boolean;
    createdAt: string;
}

export interface GoalMilestone {
    id: string;
    percentage: number;
    title: string;
    isReached: boolean;
    reachedAt?: string;
}

// --- Reminder ---
export type RepeatRule = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Reminder {
    id: string;
    title: string;
    amount: number;
    categoryId?: string;
    dueDate: string;
    repeatRule: RepeatRule;
    isActive: boolean;
    walletId?: string;
    createdAt: string;
}

// --- Insight ---
export type InsightType = 'tip' | 'warning' | 'achievement' | 'anomaly' | 'summary';
export type InsightSeverity = 'low' | 'medium' | 'high';

export interface Insight {
    id: string;
    type: InsightType;
    title: string;
    summary: string;
    severity: InsightSeverity;
    actionSuggestion?: string;
    relatedCategoryId?: string;
    isRead: boolean;
    createdAt: string;
}

// --- Challenge ---
export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'upcoming';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    type: string;
    targetAmount?: number;
    currentAmount?: number;
    startDate: string;
    endDate: string;
    status: ChallengeStatus;
    reward?: string;
    createdAt: string;
}

// --- Settings Store ---
export interface SettingsState {
    language: Language;
    currency: Currency;
    themeMode: ThemeMode;
    themePreset: ThemePreset;
    onboardingCompleted: boolean;
    userName: string;
    notificationsEnabled: boolean;
    hapticEnabled: boolean;

    // Actions
    setLanguage: (language: Language) => void;
    setCurrency: (currency: Currency) => void;
    setThemeMode: (mode: ThemeMode) => void;
    setThemePreset: (preset: ThemePreset) => void;
    setOnboardingCompleted: (completed: boolean) => void;
    setUserName: (name: string) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    setHapticEnabled: (enabled: boolean) => void;
    resetSettings: () => void;
}