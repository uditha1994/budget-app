// ============================================================
// SETUP COMPLETE SCREEN
// ============================================================

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { GradientButton } from '../../src/components/ui/GradientButton';
import { spacing, typography } from '../../src/constants';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { triggerHaptic } from '../../src/utils/haptics';

const { width } = Dimensions.get('window');

export default function SetupCompleteScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const setOnboardingCompleted = useSettingsStore((s) => s.setOnboardingCompleted);

    // Celebration animation
    const celebrationScale = useSharedValue(0);

    useEffect(() => {
        celebrationScale.value = withDelay(
            300,
            withSequence(
                withTiming(1.2, { duration: 400 }),
                withTiming(1, { duration: 200 })
            )
        );
        triggerHaptic('success');
    }, []);

    const celebrationStyle = useAnimatedStyle(() => ({
        transform: [{ scale: celebrationScale.value }],
    }));

    const handleComplete = () => {
        triggerHaptic('success');
        setOnboardingCompleted(true);
        router.replace('/(tabs)');
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.topSection}>
                    {/* Decorative elements */}
                    <View style={[styles.bgGlow, { backgroundColor: colors.primary + '15' }]} />

                    <Animated.View style={[styles.celebrationContainer, celebrationStyle]}>
                        <LinearGradient
                            colors={colors.gradientSuccess}
                            style={styles.successCircle}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="checkmark" size={56} color="#FFFFFF" />
                        </LinearGradient>
                    </Animated.View>

                    {/* Floating decorative dots */}
                    {[...Array(6)].map((_, i) => (
                        <FloatingDot key={i} index={i} color={colors.primary} />
                    ))}
                </View>

                <Animated.View
                    entering={FadeInUp.delay(600).duration(800).springify()}
                    style={styles.bottomSection}
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('onboarding.setupComplete.title')}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {t('onboarding.setupComplete.subtitle')}
                    </Text>

                    <View style={styles.buttonContainer}>
                        <GradientButton
                            title={t('onboarding.setupComplete.letsGo')}
                            onPress={handleComplete}
                            size="lg"
                            icon={<Ionicons name="rocket" size={20} color="#FFFFFF" />}
                            iconPosition="right"
                        />
                    </View>
                </Animated.View>
            </View>
        </ScreenWrapper>
    );
}

// Floating celebration dot component
const FloatingDot: React.FC<{ index: number; color: string }> = ({ index, color }) => {
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withDelay(
            index * 200,
            withRepeat(
                withSequence(
                    withTiming(-20, { duration: 1500 }),
                    withTiming(0, { duration: 1500 })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedDotStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Fixed positions using numeric percentages mapped to absolute values
    const dotConfigs = [
        { left: 50, top: 80, size: 8, opacity: 0.3 },
        { left: 280, top: 60, size: 12, opacity: 0.35 },
        { left: 35, top: 220, size: 6, opacity: 0.25 },
        { left: 270, top: 200, size: 10, opacity: 0.4 },
        { left: 100, top: 140, size: 14, opacity: 0.3 },
        { left: 220, top: 260, size: 8, opacity: 0.35 },
    ];

    const config = dotConfigs[index] || dotConfigs[0];

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute' as const,
                    width: config.size,
                    height: config.size,
                    borderRadius: config.size / 2,
                    backgroundColor: color,
                    opacity: config.opacity,
                    left: config.left,
                    top: config.top,
                },
                animatedDotStyle,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgGlow: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
    },
    celebrationContainer: {
        zIndex: 1,
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSection: {
        paddingHorizontal: spacing.screenPaddingH,
        paddingBottom: spacing['3xl'],
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.fontWeight.bold,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    subtitle: {
        fontSize: typography.size.base,
        lineHeight: typography.size.base * typography.lineHeight.relaxed,
        textAlign: 'center',
        marginBottom: spacing['2xl'],
    },
    buttonContainer: {
        width: '100%',
    },
});