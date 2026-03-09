import { Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    default: 'System',
});

export const typography = {
    // Font families
    fontFamily: {
        regular: fontFamily,
        medium: fontFamily,
        semibold: fontFamily,
        bold: fontFamily,
    },

    // Font weights
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
    },

    // Type scale
    size: {
        xs: 11,
        sm: 13,
        base: 15,
        md: 17,
        lg: 20,
        xl: 24,
        '2xl': 28,
        '3xl': 32,
        '4xl': 40,
        '5xl': 48,
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
    },

    // Letter spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },
} as const;

// Pre-built text styles
export const textStyles = {
    heroTitle: {
        fontSize: typography.size['4xl'],
        fontWeight: typography.fontWeight.extrabold,
        letterSpacing: typography.letterSpacing.tight,
        lineHeight: typography.size['4xl'] * typography.lineHeight.tight,
    },
    pageTitle: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.fontWeight.bold,
        letterSpacing: typography.letterSpacing.tight,
        lineHeight: typography.size['2xl'] * typography.lineHeight.tight,
    },
    sectionTitle: {
        fontSize: typography.size.lg,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: typography.letterSpacing.normal,
        lineHeight: typography.size.lg * typography.lineHeight.normal,
    },
    cardTitle: {
        fontSize: typography.size.md,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.size.md * typography.lineHeight.normal,
    },
    body: {
        fontSize: typography.size.base,
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.size.base * typography.lineHeight.relaxed,
    },
    bodyMedium: {
        fontSize: typography.size.base,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.size.base * typography.lineHeight.normal,
    },
    caption: {
        fontSize: typography.size.sm,
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.size.sm * typography.lineHeight.normal,
    },
    label: {
        fontSize: typography.size.sm,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: typography.letterSpacing.wide,
        lineHeight: typography.size.sm * typography.lineHeight.normal,
    },
    amount: {
        fontSize: typography.size['3xl'],
        fontWeight: typography.fontWeight.bold,
        letterSpacing: typography.letterSpacing.tight,
        lineHeight: typography.size['3xl'] * typography.lineHeight.tight,
    },
    amountSmall: {
        fontSize: typography.size.xl,
        fontWeight: typography.fontWeight.bold,
        letterSpacing: typography.letterSpacing.tight,
        lineHeight: typography.size.xl * typography.lineHeight.tight,
    },
    tag: {
        fontSize: typography.size.xs,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: typography.letterSpacing.wider,
        textTransform: 'uppercase' as const,
    },
} as const;