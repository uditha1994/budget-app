import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { borderRadius, spacing, typography } from '../../src/constants';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { triggerHaptic } from '../../src/utils/haptics';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface SettingsItem {
    icon: IoniconsName;
    label: string;
    value?: string;
    color?: string;
    onPress: () => void;
    showChevron?: boolean;
    danger?: boolean;
}

interface SettingsSection {
    title: string;
    items: SettingsItem[];
}

export default function ProfileScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const {
        userName,
        language,
        currency,
        themeMode,
        setThemeMode,
        setOnboardingCompleted,
        resetSettings,
    } = useSettingsStore();

    const getLanguageLabel = (): string => {
        switch (language) {
            case 'si':
                return 'සිංහල';
            case 'ta':
                return 'தமிழ்';
            case 'en':
            default:
                return 'English';
        }
    };

    const getThemeModeLabel = (): string => {
        switch (themeMode) {
            case 'light':
                return t('profile.light');
            case 'dark':
                return t('profile.dark');
            case 'system':
            default:
                return t('profile.system');
        }
    };

    const handleThemeToggle = () => {
        triggerHaptic('selection');
        const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(themeMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setThemeMode(modes[nextIndex]);
    };

    const handleResetApp = () => {
        triggerHaptic('warning');
        resetSettings();
        setOnboardingCompleted(false);
        router.replace('/onboarding/welcome');
    };

    const sections: SettingsSection[] = [
        {
            title: t('profile.general'),
            items: [
                {
                    icon: 'language',
                    label: t('profile.language'),
                    value: getLanguageLabel(),
                    onPress: () => {
                        triggerHaptic('selection');
                        // Navigate to language picker - will implement later
                    },
                    showChevron: true,
                },
                {
                    icon: 'cash-outline',
                    label: t('profile.currency'),
                    value: `${currency.symbol} ${currency.code}`,
                    onPress: () => {
                        triggerHaptic('selection');
                        // Navigate to currency picker - will implement later
                    },
                    showChevron: true,
                },
                {
                    icon: 'wallet-outline',
                    label: t('profile.wallets'),
                    onPress: () => {
                        triggerHaptic('selection');
                        // Navigate to wallets management - will implement later
                    },
                    showChevron: true,
                },
                {
                    icon: 'grid-outline',
                    label: t('profile.categories'),
                    onPress: () => {
                        triggerHaptic('selection');
                        // Navigate to categories management - will implement later
                    },
                    showChevron: true,
                },
            ],
        },
        {
            title: t('profile.appearance'),
            items: [
                {
                    icon: themeMode === 'dark' ? 'moon' : themeMode === 'light' ? 'sunny' : 'phone-portrait-outline',
                    label: t('profile.themeMode'),
                    value: getThemeModeLabel(),
                    onPress: handleThemeToggle,
                    showChevron: false,
                },
                {
                    icon: 'notifications-outline',
                    label: t('profile.notifications'),
                    onPress: () => {
                        triggerHaptic('selection');
                    },
                    showChevron: true,
                },
                {
                    icon: 'phone-portrait-outline',
                    label: t('profile.hapticFeedback'),
                    onPress: () => {
                        triggerHaptic('selection');
                    },
                    showChevron: true,
                },
            ],
        },
        {
            title: t('profile.data'),
            items: [
                {
                    icon: 'download-outline',
                    label: t('profile.exportData'),
                    onPress: () => {
                        triggerHaptic('selection');
                    },
                    showChevron: true,
                },
                {
                    icon: 'push-outline',
                    label: t('profile.importData'),
                    onPress: () => {
                        triggerHaptic('selection');
                    },
                    showChevron: true,
                },
                {
                    icon: 'trash-outline',
                    label: t('profile.clearData'),
                    onPress: handleResetApp,
                    showChevron: false,
                    danger: true,
                },
            ],
        },
        {
            title: t('profile.about'),
            items: [
                {
                    icon: 'star-outline',
                    label: t('profile.rateApp'),
                    onPress: () => {
                        triggerHaptic('selection');
                    },
                    showChevron: true,
                },
                {
                    icon: 'chatbubble-outline',
                    label: t('profile.feedback'),
                    onPress: () => {
                        triggerHaptic('selection');
                    },
                    showChevron: true,
                },
                {
                    icon: 'information-circle-outline',
                    label: t('profile.version'),
                    value: '1.0.0',
                    onPress: () => { },
                    showChevron: false,
                },
            ],
        },
    ];

    return (
        <ScreenWrapper scrollable safeAreaEdges={['top']}>
            {/* Profile Header */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(600)}
                style={styles.profileHeader}
            >
                <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                        {userName ? userName.charAt(0).toUpperCase() : '👤'}
                    </Text>
                </View>
                <Text style={[styles.profileName, { color: colors.text }]}>
                    {userName || 'User'}
                </Text>
                <Text style={[styles.profileSubtitle, { color: colors.textSecondary }]}>
                    {t('profile.settings')}
                </Text>
            </Animated.View>

            {/* Settings Sections */}
            {sections.map((section, sectionIndex) => (
                <Animated.View
                    key={section.title}
                    entering={FadeInDown.delay(200 + sectionIndex * 100).duration(600)}
                >
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        {section.title.toUpperCase()}
                    </Text>
                    <GlassCard padding={0} marginBottom={spacing.xl}>
                        {section.items.map((item, itemIndex) => (
                            <Pressable
                                key={item.label}
                                onPress={item.onPress}
                                style={({ pressed }) => [
                                    styles.settingsItem,
                                    pressed && { backgroundColor: colors.backgroundSecondary },
                                    itemIndex < section.items.length - 1 && {
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        borderBottomColor: colors.borderLight,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.settingsIconContainer,
                                        {
                                            backgroundColor: item.danger
                                                ? colors.error + '15'
                                                : (item.color || colors.primary) + '15',
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={item.icon}
                                        size={20}
                                        color={item.danger ? colors.error : item.color || colors.primary}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.settingsLabel,
                                        { color: item.danger ? colors.error : colors.text },
                                    ]}
                                >
                                    {item.label}
                                </Text>
                                <View style={styles.settingsRight}>
                                    {item.value && (
                                        <Text style={[styles.settingsValue, { color: colors.textSecondary }]}>
                                            {item.value}
                                        </Text>
                                    )}
                                    {item.showChevron && (
                                        <Ionicons
                                            name="chevron-forward"
                                            size={18}
                                            color={colors.textTertiary}
                                            style={styles.chevron}
                                        />
                                    )}
                                </View>
                            </Pressable>
                        ))}
                    </GlassCard>
                </Animated.View>
            ))}

            {/* Bottom spacing for tab bar */}
            <View style={{ height: 100 }} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    // Profile Header
    profileHeader: {
        alignItems: 'center',
        paddingVertical: spacing['2xl'],
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    avatarText: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.fontWeight.bold,
    },
    profileName: {
        fontSize: typography.size.xl,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xxs,
    },
    profileSubtitle: {
        fontSize: typography.size.sm,
    },

    // Section
    sectionTitle: {
        fontSize: typography.size.xs,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: typography.letterSpacing.wider,
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.xs,
    },

    // Settings Item
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.base,
    },
    settingsIconContainer: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    settingsLabel: {
        flex: 1,
        fontSize: typography.size.base,
        fontWeight: typography.fontWeight.medium,
    },
    settingsRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsValue: {
        fontSize: typography.size.sm,
        marginRight: spacing.xs,
    },
    chevron: {
        marginLeft: spacing.xxs,
    },
});