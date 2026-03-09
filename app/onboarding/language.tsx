import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Header } from '../../src/components/layout/Header';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { GradientButton } from '../../src/components/ui/GradientButton';
import { borderRadius, spacing, typography } from '../../src/constants';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { Language } from '../../src/types';
import { triggerHaptic } from '../../src/utils/haptics';

const languages: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
    { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇱🇰' },
];

export default function LanguageScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { language, setLanguage } = useSettingsStore();

    const handleSelect = (code: Language) => {
        triggerHaptic('selection');
        setLanguage(code);
    };

    return (
        <ScreenWrapper>
            <Header title="" showBack />
            <View style={styles.container}>
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('onboarding.language.title')}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {t('onboarding.language.subtitle')}
                    </Text>
                </Animated.View>

                <View style={styles.languageList}>
                    {languages.map((lang, index) => {
                        const isSelected = language === lang.code;
                        return (
                            <Animated.View
                                key={lang.code}
                                entering={FadeInDown.delay(200 + index * 100).duration(600).springify()}
                            >
                                <Pressable
                                    onPress={() => handleSelect(lang.code)}
                                    style={[
                                        styles.languageCard,
                                        {
                                            backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                                            borderColor: isSelected ? colors.primary : colors.border,
                                            borderWidth: isSelected ? 2 : 1,
                                        },
                                    ]}
                                >
                                    <Text style={styles.flag}>{lang.flag}</Text>
                                    <View style={styles.languageInfo}>
                                        <Text style={[styles.languageName, { color: colors.text }]}>
                                            {lang.nativeLabel}
                                        </Text>
                                        <Text style={[styles.languageSubname, { color: colors.textSecondary }]}>
                                            {lang.label}
                                        </Text>
                                    </View>
                                    {isSelected && (
                                        <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                        </View>
                                    )}
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <GradientButton
                        title={t('common.continue')}
                        onPress={() => router.push('/onboarding/currency')}
                        size="lg"
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.screenPaddingH,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.size.base,
        lineHeight: typography.size.base * typography.lineHeight.relaxed,
        marginBottom: spacing['2xl'],
    },
    languageList: {
        gap: spacing.md,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.base,
        borderRadius: borderRadius.xl,
        gap: spacing.base,
    },
    flag: {
        fontSize: 32,
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        fontSize: typography.size.md,
        fontWeight: typography.fontWeight.semibold,
    },
    languageSubname: {
        fontSize: typography.size.sm,
        marginTop: 2,
    },
    checkmark: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: spacing['2xl'],
    },
});