import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Header } from '../../src/components/layout/Header';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { GradientButton } from '../../src/components/ui/GradientButton';
import { borderRadius, currencies, spacing, typography } from '../../src/constants';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { Currency } from '../../src/types';
import { triggerHaptic } from '../../src/utils/haptics';

export default function CurrencyScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { currency, setCurrency } = useSettingsStore();
    const [search, setSearch] = useState('');

    const filteredCurrencies = useMemo(() => {
        if (!search.trim()) return currencies;
        const query = search.toLowerCase();
        return currencies.filter(
            (c) =>
                c.code.toLowerCase().includes(query) ||
                c.name.toLowerCase().includes(query)
        );
    }, [search]);

    const handleSelect = (cur: Currency) => {
        triggerHaptic('selection');
        setCurrency(cur);
    };

    const renderCurrencyItem = ({ item, index }: { item: Currency; index: number }) => {
        const isSelected = currency.code === item.code;
        return (
            <Pressable
                onPress={() => handleSelect(item)}
                style={[
                    styles.currencyCard,
                    {
                        backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                        borderWidth: isSelected ? 2 : 1,
                    },
                ]}
            >
                <View style={[styles.currencySymbolContainer, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.currencySymbol, { color: colors.primary }]}>
                        {item.symbol}
                    </Text>
                </View>
                <View style={styles.currencyInfo}>
                    <Text style={[styles.currencyCode, { color: colors.text }]}>
                        {item.code}
                    </Text>
                    <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
                        {item.name}
                    </Text>
                </View>
                {isSelected && (
                    <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <ScreenWrapper>
            <Header title="" showBack />
            <View style={styles.container}>
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('onboarding.currency.title')}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {t('onboarding.currency.subtitle')}
                    </Text>
                </Animated.View>

                {/* Search Bar */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Ionicons name="search" size={20} color={colors.textTertiary} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.text }]}
                            placeholder={t('onboarding.currency.searchPlaceholder')}
                            placeholderTextColor={colors.textTertiary}
                            value={search}
                            onChangeText={setSearch}
                        />
                        {search.length > 0 && (
                            <Pressable onPress={() => setSearch('')}>
                                <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                            </Pressable>
                        )}
                    </View>
                </Animated.View>

                {/* Currency List */}
                <FlatList
                    data={filteredCurrencies}
                    renderItem={renderCurrencyItem}
                    keyExtractor={(item) => item.code}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                />

                <View style={styles.footer}>
                    <GradientButton
                        title={t('common.continue')}
                        onPress={() => router.push('/onboarding/setup-complete')}
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
        marginBottom: spacing.lg,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        marginBottom: spacing.base,
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: typography.size.base,
        padding: 0,
    },
    list: {
        flex: 1,
    },
    listContent: {
        gap: spacing.sm,
        paddingBottom: spacing.base,
    },
    currencyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.md,
    },
    currencySymbolContainer: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currencySymbol: {
        fontSize: typography.size.md,
        fontWeight: typography.fontWeight.bold,
    },
    currencyInfo: {
        flex: 1,
    },
    currencyCode: {
        fontSize: typography.size.base,
        fontWeight: typography.fontWeight.semibold,
    },
    currencyName: {
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
        paddingVertical: spacing.base,
    },
});