import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { borderRadius, shadows, spacing } from '../../constants';
import { useTheme } from '../../theme/ThemeContext';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: number;
    marginBottom?: number;
    variant?: 'default' | 'elevated' | 'outlined';
    onLayout?: (event: any) => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    padding = spacing.cardPadding,
    marginBottom = spacing.md,
    variant = 'default',
    onLayout,
}) => {
    const { colors, isDark } = useTheme();

    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: isDark ? colors.surfaceElevated : colors.surface,
                    ...shadows.md,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: colors.border,
                };
            case 'default':
            default:
                return {
                    backgroundColor: isDark ? colors.glass : colors.surface,
                    borderWidth: 1,
                    borderColor: isDark ? colors.glassBorder : colors.borderLight,
                    ...(Platform.OS !== 'web' ? shadows.sm : {}),
                };
        }
    };

    return (
        <View
            style={[
                styles.card,
                getVariantStyle(),
                { padding, marginBottom },
                style,
            ]}
            onLayout={onLayout}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
});