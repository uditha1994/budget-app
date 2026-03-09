import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { GradientButton } from '../../src/components/ui/GradientButton';
import { borderRadius, spacing, typography } from '../../src/constants';
import { useTheme } from '../../src/theme/ThemeContext';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { t } = useTranslation();

    return (
        <ScreenWrapper style={styles.screen}>
            <View style={styles.container}>
                {/* Top Section - Logo & Visual */}
                <View style={styles.topSection}>
                    {/* Decorative background circles */}
                    <View style={[styles.bgCircle1, { backgroundColor: colors.primary + '15' }]} />
                    <View style={[styles.bgCircle2, { backgroundColor: colors.primary + '10' }]} />

                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800).springify()}
                        style={styles.logoContainer}
                    >
                        <LinearGradient
                            colors={colors.gradientPrimary}
                            style={styles.logoGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="wallet" size={48} color="#FFFFFF" />
                        </LinearGradient>
                    </Animated.View>

                    <Animated.Text
                        entering={FadeInDown.delay(400).duration(800).springify()}
                        style={[styles.appName, { color: colors.primary }]}
                    >
                        {t('common.appName')}
                    </Animated.Text>

                    {/* Feature highlights */}
                    <Animated.View
                        entering={FadeInDown.delay(600).duration(800).springify()}
                        style={styles.featuresContainer}
                    >
                        {[
                            { icon: 'trending-up' as const, label: 'Smart Budgets' },
                            { icon: 'pie-chart' as const, label: 'Visual Insights' },
                            { icon: 'shield-checkmark' as const, label: 'Secure & Private' },
                        ].map((feature, index) => (
                            <View
                                key={feature.label}
                                style={[styles.featurePill, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
                            >
                                <Ionicons name={feature.icon} size={16} color={colors.primary} />
                                <Text style={[styles.featureLabel, { color: colors.textSecondary }]}>
                                    {feature.label}
                                </Text>
                            </View>
                        ))}
                    </Animated.View>
                </View>

                {/* Bottom Section - Text & CTA */}
                <Animated.View
                    entering={FadeInUp.delay(800).duration(800).springify()}
                    style={styles.bottomSection}
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('onboarding.welcome.title')}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {t('onboarding.welcome.subtitle')}
                    </Text>

                    <View style={styles.buttonContainer}>
                        <GradientButton
                            title={t('onboarding.welcome.getStarted')}
                            onPress={() => router.push('/onboarding/language')}
                            size="lg"
                            icon={<Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
                            iconPosition="right"
                        />
                    </View>
                </Animated.View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing['3xl'],
        overflow: 'hidden',
    },
    bgCircle1: {
        position: 'absolute',
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width * 0.75,
        top: -width * 0.5,
        right: -width * 0.3,
    },
    bgCircle2: {
        position: 'absolute',
        width: width,
        height: width,
        borderRadius: width * 0.5,
        bottom: -width * 0.2,
        left: -width * 0.3,
    },
    logoContainer: {
        marginBottom: spacing.lg,
    },
    logoGradient: {
        width: 96,
        height: 96,
        borderRadius: borderRadius['2xl'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.fontWeight.extrabold,
        letterSpacing: typography.letterSpacing.tight,
        marginBottom: spacing['2xl'],
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.xl,
    },
    featurePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        gap: spacing.xs,
    },
    featureLabel: {
        fontSize: typography.size.sm,
        fontWeight: typography.fontWeight.medium,
    },
    bottomSection: {
        paddingHorizontal: spacing.screenPaddingH,
        paddingBottom: spacing['3xl'],
    },
    title: {
        fontSize: typography.size['3xl'],
        fontWeight: typography.fontWeight.extrabold,
        letterSpacing: typography.letterSpacing.tight,
        lineHeight: typography.size['3xl'] * typography.lineHeight.tight,
        marginBottom: spacing.md,
    },
    subtitle: {
        fontSize: typography.size.base,
        lineHeight: typography.size.base * typography.lineHeight.relaxed,
        marginBottom: spacing['2xl'],
    },
    buttonContainer: {
        width: '100%',
    },
});