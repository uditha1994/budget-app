import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../../constants';
import { useTheme } from '../../theme/ThemeContext';
import { triggerHaptic } from '../../utils/haptics';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
    onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    rightAction,
    onBackPress,
}) => {
    const { colors } = useTheme();
    const router = useRouter();

    const handleBack = () => {
        triggerHaptic('selection');
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                {showBack && (
                    <Pressable onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </Pressable>
                )}
            </View>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {title}
            </Text>
            <View style={styles.right}>
                {rightAction || <View style={styles.placeholder} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.screenPaddingH,
        paddingVertical: spacing.md,
        minHeight: 52,
    },
    left: {
        width: 40,
        alignItems: 'flex-start',
    },
    right: {
        width: 40,
        alignItems: 'flex-end',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: typography.size.md,
        fontWeight: typography.fontWeight.semibold,
    },
    backButton: {
        padding: spacing.xs,
        margin: -spacing.xs,
    },
    placeholder: {
        width: 24,
    },
});