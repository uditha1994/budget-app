import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { borderRadius, shadows, spacing, typography } from '../../constants';
import { useTheme } from '../../theme/ThemeContext';
import { triggerHaptic } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    gradientColors?: [string, string];
}

export const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    fullWidth = true,
    style,
    textStyle,
    gradientColors,
}) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    }, []);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, []);

    const handlePress = useCallback(() => {
        if (disabled || loading) return;
        triggerHaptic('light');
        onPress();
    }, [disabled, loading, onPress]);

    const sizeStyles = getSizeStyles(size);
    const isOutlineOrGhost = variant === 'outline' || variant === 'ghost';

    const getGradientColors = (): [string, string] => {
        if (gradientColors) return gradientColors;
        switch (variant) {
            case 'secondary':
                return colors.gradientSecondary;
            case 'primary':
            default:
                return colors.gradientPrimary;
        }
    };

    const getTextColor = (): string => {
        if (disabled) return colors.textTertiary;
        if (isOutlineOrGhost) return colors.primary;
        return colors.textInverse;
    };

    const content = (
        <View style={[styles.content, sizeStyles.content]}>
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={isOutlineOrGhost ? colors.primary : colors.textInverse}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <View style={styles.iconLeft}>{icon}</View>
                    )}
                    <Text
                        style={[
                            styles.text,
                            sizeStyles.text,
                            { color: getTextColor() },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <View style={styles.iconRight}>{icon}</View>
                    )}
                </>
            )}
        </View>
    );

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[
                animatedStyle,
                fullWidth && styles.fullWidth,
                style,
            ]}
        >
            {isOutlineOrGhost ? (
                <View
                    style={[
                        styles.button,
                        sizeStyles.button,
                        variant === 'outline' && {
                            borderWidth: 1.5,
                            borderColor: disabled ? colors.textTertiary : colors.primary,
                        },
                        disabled && styles.disabled,
                    ]}
                >
                    {content}
                </View>
            ) : (
                <LinearGradient
                    colors={disabled ? [colors.textTertiary, colors.textTertiary] : getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.button,
                        sizeStyles.button,
                        disabled && styles.disabled,
                        !disabled && shadows.glow(colors.primary),
                    ]}
                >
                    {content}
                </LinearGradient>
            )}
        </AnimatedPressable>
    );
};

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
        case 'sm':
            return {
                button: { borderRadius: borderRadius.lg, minHeight: 40 },
                content: { paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
                text: { fontSize: typography.size.sm, fontWeight: typography.fontWeight.semibold as TextStyle['fontWeight'] },
            };
        case 'lg':
            return {
                button: { borderRadius: borderRadius['2xl'], minHeight: 60 },
                content: { paddingHorizontal: spacing.xl, paddingVertical: spacing.base },
                text: { fontSize: typography.size.md, fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'] },
            };
        case 'md':
        default:
            return {
                button: { borderRadius: borderRadius.xl, minHeight: 52 },
                content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
                text: { fontSize: typography.size.base, fontWeight: typography.fontWeight.semibold as TextStyle['fontWeight'] },
            };
    }
};

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
    button: {
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
    iconLeft: {
        marginRight: spacing.sm,
    },
    iconRight: {
        marginLeft: spacing.sm,
    },
    disabled: {
        opacity: 0.5,
    },
});