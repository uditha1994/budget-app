import { palette } from '../constants/colors';
import { ThemeColors, ThemePreset } from '../types';

// --- LIGHT THEMES ---

const orangeLight: ThemeColors = {
    primary: palette.orange[500],
    primaryLight: palette.orange[100],
    primaryDark: palette.orange[700],
    secondary: palette.navy[500],
    accent: palette.purple[500],

    background: '#FDF8F3',
    backgroundSecondary: '#F7F0E8',
    backgroundTertiary: palette.warmGray[100],
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',

    text: palette.warmGray[900],
    textSecondary: palette.warmGray[600],
    textTertiary: palette.warmGray[400],
    textInverse: palette.white,

    success: palette.green[500],
    warning: palette.yellow[500],
    error: palette.red[500],
    info: palette.blue[500],

    border: palette.warmGray[200],
    borderLight: palette.warmGray[100],
    shadow: 'rgba(0,0,0,0.08)',
    overlay: 'rgba(0,0,0,0.4)',
    tabBar: '#FFFFFF',
    tabBarInactive: palette.warmGray[400],

    glass: 'rgba(255,255,255,0.7)',
    glassBorder: 'rgba(255,255,255,0.3)',

    gradientPrimary: [palette.orange[400], palette.orange[600]],
    gradientSecondary: ['#FF9A56', '#FF6B35'],
    gradientSuccess: [palette.green[400], palette.green[600]],
    gradientWarning: [palette.yellow[400], palette.orange[400]],
    gradientDanger: [palette.red[400], palette.red[600]],

    income: palette.green[500],
    expense: palette.red[500],
    transfer: palette.blue[500],
};

// --- DARK THEMES ---

const orangeDark: ThemeColors = {
    primary: palette.orange[400],
    primaryLight: 'rgba(249,115,22,0.15)',
    primaryDark: palette.orange[600],
    secondary: palette.navy[400],
    accent: palette.purple[400],

    background: palette.navy[950],
    backgroundSecondary: palette.navy[900],
    backgroundTertiary: palette.navy[800],
    surface: 'rgba(255,255,255,0.06)',
    surfaceElevated: 'rgba(255,255,255,0.1)',

    text: '#F5F5F4',
    textSecondary: '#A8A29E',
    textTertiary: '#78716C',
    textInverse: palette.navy[950],

    success: palette.green[400],
    warning: palette.yellow[400],
    error: palette.red[400],
    info: palette.blue[400],

    border: 'rgba(255,255,255,0.1)',
    borderLight: 'rgba(255,255,255,0.05)',
    shadow: 'rgba(0,0,0,0.3)',
    overlay: 'rgba(0,0,0,0.6)',
    tabBar: palette.navy[900],
    tabBarInactive: palette.warmGray[600],

    glass: 'rgba(255,255,255,0.08)',
    glassBorder: 'rgba(255,255,255,0.12)',

    gradientPrimary: [palette.orange[500], palette.orange[700]],
    gradientSecondary: ['#FF8C42', '#E85D26'],
    gradientSuccess: [palette.green[500], palette.green[500]],
    gradientWarning: [palette.yellow[500], palette.orange[500]],
    gradientDanger: [palette.red[500], palette.red[500]],

    income: palette.green[400],
    expense: palette.red[400],
    transfer: palette.blue[400],
};

// Theme Map
export const themes: Record<ThemePreset, { light: ThemeColors; dark: ThemeColors }> = {
    orange: { light: orangeLight, dark: orangeDark },
    // These will use orange as base for now, can be customized later
    calm: { light: orangeLight, dark: orangeDark },
    neon: { light: orangeLight, dark: orangeDark },
    minimal: { light: orangeLight, dark: orangeDark },
    growth: { light: orangeLight, dark: orangeDark },
};