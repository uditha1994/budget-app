import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { borderRadius, spacing, typography } from '../../constants';
import { useTheme } from '../../theme/ThemeContext';

interface BadgeProps {
    label: string;
    color?: string;
    variant?: 'filled' | 'outline' | 'soft';
    size?: 'sm' | 'md';
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    color,
    variant = 'soft',
    size = 'sm',
    style,
}) => {
    const { colors } = useTheme();
    const badgeColor = color || colors.primary;

    const getContainerStyle = (): ViewStyle => {
        switch (variant) {
            case 'filled':
                return { backgroundColor: badgeColor };
            case 'outline':
                return { borderWidth: 1, borderColor: badgeColor, backgroundColor: 'transparent' };
            case 'soft':
            default:
                return { backgroundColor: badgeColor + '18' };
        }
    };

    const getTextColor = (): string => {
        switch (variant) {
            case 'filled':
                return '#FFFFFF';
            case 'outline':
            case 'soft':
            default:
                return badgeColor;
        }
    };

    return (
        <View
            style={[
                styles.badge,
                getContainerStyle(),
                size === 'sm' ? styles.sm : styles.md,
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: getTextColor() },
                    size === 'sm' ? styles.textSm : styles.textMd,
                ]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
    },
    sm: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
    },
    md: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    text: {
        fontWeight: typography.fontWeight.semibold,
    },
    textSm: {
        fontSize: typography.size.xs,
    },
    textMd: {
        fontSize: typography.size.sm,
    },
});