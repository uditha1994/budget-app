import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing, typography } from '../../constants';
import { useTheme } from '../../theme/ThemeContext';
import { GradientButton } from './GradientButton';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    actionLabel?: string;
    onAction?: () => void;
    emoji?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'add-circle-outline',
    title,
    subtitle,
    actionLabel,
    onAction,
    emoji,
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                {emoji ? (
                    <Text style={styles.emoji}>{emoji}</Text>
                ) : (
                    <Ionicons name={icon} size={48} color={colors.primary} />
                )}
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            {actionLabel && onAction && (
                <View style={styles.action}>
                    <GradientButton
                        title={actionLabel}
                        onPress={onAction}
                        size="md"
                        fullWidth={false}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing['3xl'],
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    emoji: {
        fontSize: 48,
    },
    title: {
        fontSize: typography.size.lg,
        fontWeight: typography.fontWeight.bold,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.size.base,
        textAlign: 'center',
        lineHeight: typography.size.base * typography.lineHeight.relaxed,
        maxWidth: 280,
    },
    action: {
        marginTop: spacing.xl,
    },
});