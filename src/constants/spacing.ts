export const spacing = {
    // Base scale (4px increments)
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
    '6xl': 80,

    // Screen padding
    screenPaddingH: 20,
    screenPaddingV: 16,

    // Card padding
    cardPadding: 16,
    cardPaddingLg: 20,
} as const;

export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 999,
} as const;

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
    },
    glow: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    }),
} as const;

// Layout constants
export const layout = {
    tabBarHeight: 85,
    headerHeight: 56,
    fabSize: 60,
    iconSizeSm: 20,
    iconSizeMd: 24,
    iconSizeLg: 28,
    iconSizeXl: 32,
    avatarSm: 32,
    avatarMd: 40,
    avatarLg: 56,
    progressRingSize: 120,
    progressRingSizeSm: 80,
} as const;