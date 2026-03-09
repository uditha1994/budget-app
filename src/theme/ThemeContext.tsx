import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../stores/useSettingsStore';
import { ThemeColors, ThemeMode, ThemePreset } from '../types';
import { themes } from './themes';

interface ThemeContextType {
    colors: ThemeColors;
    isDark: boolean;
    themeMode: ThemeMode;
    themePreset: ThemePreset;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const { themeMode, themePreset } = useSettingsStore();

    const value = useMemo(() => {
        let isDark: boolean;

        switch (themeMode) {
            case 'dark':
                isDark = true;
                break;
            case 'light':
                isDark = false;
                break;
            case 'system':
            default:
                isDark = systemScheme === 'dark';
                break;
        }

        const themeSet = themes[themePreset] || themes.orange;
        const colors = isDark ? themeSet.dark : themeSet.light;

        return {
            colors,
            isDark,
            themeMode,
            themePreset,
        };
    }, [themeMode, themePreset, systemScheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};