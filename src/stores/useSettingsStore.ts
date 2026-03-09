import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { defaultCurrency } from '../constants';
import i18n from '../i18n';
import { Currency, Language, SettingsState, ThemeMode, ThemePreset } from '../types';

const initialState = {
    language: 'en' as Language,
    currency: defaultCurrency as Currency,
    themeMode: 'system' as ThemeMode,
    themePreset: 'orange' as ThemePreset,
    onboardingCompleted: false,
    userName: '',
    notificationsEnabled: true,
    hapticEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setLanguage: (language: Language) => {
                i18n.changeLanguage(language);
                set({ language });
            },

            setCurrency: (currency: Currency) => {
                set({ currency });
            },

            setThemeMode: (themeMode: ThemeMode) => {
                set({ themeMode });
            },

            setThemePreset: (themePreset: ThemePreset) => {
                set({ themePreset });
            },

            setOnboardingCompleted: (onboardingCompleted: boolean) => {
                set({ onboardingCompleted });
            },

            setUserName: (userName: string) => {
                set({ userName });
            },

            setNotificationsEnabled: (notificationsEnabled: boolean) => {
                set({ notificationsEnabled });
            },

            setHapticEnabled: (hapticEnabled: boolean) => {
                set({ hapticEnabled });
            },

            resetSettings: () => {
                i18n.changeLanguage('en');
                set(initialState);
            },
        }),
        {
            name: 'budget-app-settings',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                language: state.language,
                currency: state.currency,
                themeMode: state.themeMode,
                themePreset: state.themePreset,
                onboardingCompleted: state.onboardingCompleted,
                userName: state.userName,
                notificationsEnabled: state.notificationsEnabled,
                hapticEnabled: state.hapticEnabled,
            }),
            onRehydrateStorage: () => {
                return (state, error) => {
                    if (error) {
                        console.warn('Settings store rehydration error:', error);
                        return;
                    }
                    // Sync language when store rehydrates
                    if (state?.language) {
                        i18n.changeLanguage(state.language);
                    }
                };
            },
        }
    )
);