import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    borderRadius,
    defaultCategories,
    spacing,
    typography,
} from '../src/constants';
import { useBudgetStore } from '../src/stores/useBudgetStore';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { useTransactionStore } from '../src/stores/useTransactionStore';
import { useWalletStore } from '../src/stores/useWalletStore';
import { useTheme } from '../src/theme/ThemeContext';
import { MoodTag, TransactionType } from '../src/types';
import { triggerHaptic } from '../src/utils/haptics';

type IoniconsName = keyof typeof Ionicons.glyphMap;

const MOODS: { key: MoodTag; emoji: string }[] = [
    { key: 'happy', emoji: '😊' },
    { key: 'stressed', emoji: '😰' },
    { key: 'social', emoji: '🎉' },
    { key: 'tired', emoji: '😴' },
    { key: 'celebration', emoji: '🥳' },
    { key: 'impulsive', emoji: '⚡' },
    { key: 'planned', emoji: '📋' },
    { key: 'neutral', emoji: '😐' },
];

export default function AddTransactionScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { currency } = useSettingsStore();

    const wallets = useWalletStore((s) => s.wallets);
    const addTransaction = useTransactionStore((s) => s.addTransaction);
    const updateBalance = useWalletStore((s) => s.updateBalance);
    const updateSpentAmount = useBudgetStore((s) => s.updateSpentAmount);

    // Form state
    const [transactionType, setTransactionType] =
        useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedWalletId, setSelectedWalletId] = useState<string>(
        wallets[0]?.id || ''
    );
    const [note, setNote] = useState('');
    const [selectedMood, setSelectedMood] = useState<MoodTag | undefined>();
    const [showCategories, setShowCategories] = useState(false);
    const [showWallets, setShowWallets] = useState(false);
    const [showMoods, setShowMoods] = useState(false);

    // Get categories based on type
    const categories = useMemo(() => {
        return defaultCategories.filter((c) => c.type === transactionType);
    }, [transactionType]);

    // Selected category object
    const categoryObj = useMemo(() => {
        return defaultCategories.find((c) => c.id === selectedCategory);
    }, [selectedCategory]);

    // Selected wallet object
    const selectedWallet = useMemo(() => {
        return wallets.find((w) => w.id === selectedWalletId);
    }, [wallets, selectedWalletId]);

    // Type colors
    const typeColors = {
        expense: colors.expense,
        income: colors.income,
        transfer: colors.transfer,
    };

    const handleTypeChange = useCallback(
        (type: TransactionType) => {
            triggerHaptic('selection');
            setTransactionType(type);
            setSelectedCategory('');
        },
        []
    );

    const handleSave = useCallback(() => {
        // Validation
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (!selectedCategory) {
            Alert.alert('Error', 'Please select a category');
            return;
        }

        if (!selectedWalletId) {
            Alert.alert('Error', 'Please select a wallet');
            return;
        }

        triggerHaptic('success');

        // Create transaction
        addTransaction({
            amount: numAmount,
            type: transactionType,
            categoryId: selectedCategory,
            walletId: selectedWalletId,
            note: note.trim(),
            tags: [],
            mood: selectedMood,
            date: new Date().toISOString(),
            isRecurring: false,
        });

        // Update wallet balance
        if (transactionType === 'expense') {
            updateBalance(selectedWalletId, -numAmount);
            updateSpentAmount(selectedCategory, numAmount);
        } else if (transactionType === 'income') {
            updateBalance(selectedWalletId, numAmount);
        }

        router.back();
    }, [
        amount,
        selectedCategory,
        selectedWalletId,
        transactionType,
        note,
        selectedMood,
    ]);

    return (
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View
                style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
            >
                <Pressable
                    onPress={() => {
                        triggerHaptic('selection');
                        router.back();
                    }}
                    style={styles.headerButton}
                >
                    <Ionicons name="close" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {transactionType === 'expense'
                        ? t('transactions.addExpense')
                        : transactionType === 'income'
                            ? t('transactions.addIncome')
                            : t('transactions.addTransfer')}
                </Text>
                <View style={styles.headerButton} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Transaction Type Selector */}
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(500)}
                        style={[
                            styles.typeSelector,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        {(
                            [
                                { type: 'expense', icon: 'arrow-up-circle' },
                                { type: 'income', icon: 'arrow-down-circle' },
                                { type: 'transfer', icon: 'swap-horizontal-circle' },
                            ] as Array<{ type: TransactionType; icon: IoniconsName }>
                        ).map(({ type, icon }) => {
                            const isActive = transactionType === type;
                            return (
                                <Pressable
                                    key={type}
                                    onPress={() => handleTypeChange(type)}
                                    style={[
                                        styles.typeButton,
                                        isActive && {
                                            backgroundColor: typeColors[type] + '18',
                                            borderColor: typeColors[type],
                                            borderWidth: 1.5,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={icon}
                                        size={20}
                                        color={isActive ? typeColors[type] : colors.textTertiary}
                                    />
                                    <Text
                                        style={[
                                            styles.typeLabel,
                                            {
                                                color: isActive
                                                    ? typeColors[type]
                                                    : colors.textTertiary,
                                                fontWeight: isActive ? '700' : '500',
                                            },
                                        ]}
                                    >
                                        {t(`transactions.${type}`)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </Animated.View>

                    {/* Amount Input */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(500)}
                        style={styles.amountSection}
                    >
                        <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>
                            {currency.symbol}
                        </Text>
                        <TextInput
                            style={[styles.amountInput, { color: colors.text }]}
                            placeholder="0.00"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={setAmount}
                            autoFocus
                        />
                    </Animated.View>

                    {/* Category Selector */}
                    <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                        <Pressable
                            onPress={() => {
                                triggerHaptic('selection');
                                setShowCategories(!showCategories);
                            }}
                            style={[
                                styles.fieldButton,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: selectedCategory
                                        ? categoryObj?.color || colors.border
                                        : colors.border,
                                    borderWidth: selectedCategory ? 1.5 : 1,
                                },
                            ]}
                        >
                            {categoryObj ? (
                                <View
                                    style={[
                                        styles.fieldIcon,
                                        { backgroundColor: categoryObj.color + '18' },
                                    ]}
                                >
                                    <Ionicons
                                        name={categoryObj.icon as IoniconsName}
                                        size={20}
                                        color={categoryObj.color}
                                    />
                                </View>
                            ) : (
                                <View
                                    style={[
                                        styles.fieldIcon,
                                        { backgroundColor: colors.backgroundSecondary },
                                    ]}
                                >
                                    <Ionicons
                                        name="grid-outline"
                                        size={20}
                                        color={colors.textTertiary}
                                    />
                                </View>
                            )}
                            <Text
                                style={[
                                    styles.fieldLabel,
                                    {
                                        color: categoryObj
                                            ? colors.text
                                            : colors.textTertiary,
                                    },
                                ]}
                            >
                                {categoryObj
                                    ? t(categoryObj.nameKey)
                                    : t('transactions.category')}
                            </Text>
                            <Ionicons
                                name={showCategories ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={colors.textTertiary}
                            />
                        </Pressable>

                        {/* Category Grid */}
                        {showCategories && (
                            <Animated.View
                                entering={FadeIn.duration(300)}
                                style={[
                                    styles.categoryGrid,
                                    { backgroundColor: colors.surface, borderColor: colors.border },
                                ]}
                            >
                                {categories.map((cat) => {
                                    const isSelected = selectedCategory === cat.id;
                                    return (
                                        <Pressable
                                            key={cat.id}
                                            onPress={() => {
                                                triggerHaptic('selection');
                                                setSelectedCategory(cat.id);
                                                setShowCategories(false);
                                            }}
                                            style={[
                                                styles.categoryItem,
                                                isSelected && {
                                                    backgroundColor: cat.color + '18',
                                                    borderColor: cat.color,
                                                    borderWidth: 1.5,
                                                },
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.categoryIcon,
                                                    { backgroundColor: cat.color + '18' },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={cat.icon as IoniconsName}
                                                    size={20}
                                                    color={cat.color}
                                                />
                                            </View>
                                            <Text
                                                style={[
                                                    styles.categoryLabel,
                                                    {
                                                        color: isSelected ? cat.color : colors.text,
                                                        fontWeight: isSelected ? '600' : '400',
                                                    },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {t(cat.nameKey)}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </Animated.View>
                        )}
                    </Animated.View>

                    {/* Wallet Selector */}
                    <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                        <Pressable
                            onPress={() => {
                                triggerHaptic('selection');
                                setShowWallets(!showWallets);
                            }}
                            style={[
                                styles.fieldButton,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.fieldIcon,
                                    {
                                        backgroundColor: selectedWallet
                                            ? selectedWallet.color + '18'
                                            : colors.backgroundSecondary,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="wallet"
                                    size={20}
                                    color={selectedWallet?.color || colors.textTertiary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.fieldLabel,
                                    {
                                        color: selectedWallet
                                            ? colors.text
                                            : colors.textTertiary,
                                    },
                                ]}
                            >
                                {selectedWallet?.name || t('transactions.wallet')}
                            </Text>
                            <Ionicons
                                name={showWallets ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={colors.textTertiary}
                            />
                        </Pressable>

                        {/* Wallet List */}
                        {showWallets && (
                            <Animated.View
                                entering={FadeIn.duration(300)}
                                style={[
                                    styles.walletList,
                                    { backgroundColor: colors.surface, borderColor: colors.border },
                                ]}
                            >
                                {wallets.map((wallet) => {
                                    const isSelected = selectedWalletId === wallet.id;
                                    return (
                                        <Pressable
                                            key={wallet.id}
                                            onPress={() => {
                                                triggerHaptic('selection');
                                                setSelectedWalletId(wallet.id);
                                                setShowWallets(false);
                                            }}
                                            style={[
                                                styles.walletItem,
                                                isSelected && {
                                                    backgroundColor: wallet.color + '18',
                                                },
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.walletIcon,
                                                    { backgroundColor: wallet.color + '18' },
                                                ]}
                                            >
                                                <Ionicons
                                                    name="wallet"
                                                    size={18}
                                                    color={wallet.color}
                                                />
                                            </View>
                                            <View style={styles.walletInfo}>
                                                <Text
                                                    style={[styles.walletName, { color: colors.text }]}
                                                >
                                                    {wallet.name}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.walletBalance,
                                                        { color: colors.textSecondary },
                                                    ]}
                                                >
                                                    {currency.symbol}{' '}
                                                    {wallet.currentBalance.toLocaleString()}
                                                </Text>
                                            </View>
                                            {isSelected && (
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={22}
                                                    color={wallet.color}
                                                />
                                            )}
                                        </Pressable>
                                    );
                                })}
                            </Animated.View>
                        )}
                    </Animated.View>

                    {/* Note Input */}
                    <Animated.View entering={FadeInDown.delay(500).duration(500)}>
                        <View
                            style={[
                                styles.noteContainer,
                                { backgroundColor: colors.surface, borderColor: colors.border },
                            ]}
                        >
                            <Ionicons
                                name="create-outline"
                                size={20}
                                color={colors.textTertiary}
                            />
                            <TextInput
                                style={[styles.noteInput, { color: colors.text }]}
                                placeholder={t('transactions.note')}
                                placeholderTextColor={colors.textTertiary}
                                value={note}
                                onChangeText={setNote}
                                multiline
                                maxLength={200}
                            />
                        </View>
                    </Animated.View>

                    {/* Mood Selector */}
                    {transactionType === 'expense' && (
                        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
                            <Pressable
                                onPress={() => {
                                    triggerHaptic('selection');
                                    setShowMoods(!showMoods);
                                }}
                                style={[
                                    styles.fieldButton,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.fieldIcon,
                                        { backgroundColor: colors.backgroundSecondary },
                                    ]}
                                >
                                    <Text style={{ fontSize: 18 }}>
                                        {selectedMood
                                            ? MOODS.find((m) => m.key === selectedMood)?.emoji
                                            : '😐'}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.fieldLabel,
                                        {
                                            color: selectedMood
                                                ? colors.text
                                                : colors.textTertiary,
                                        },
                                    ]}
                                >
                                    {selectedMood
                                        ? t(`moods.${selectedMood}`)
                                        : t('transactions.mood')}
                                </Text>
                                <Ionicons
                                    name={showMoods ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={colors.textTertiary}
                                />
                            </Pressable>

                            {showMoods && (
                                <Animated.View
                                    entering={FadeIn.duration(300)}
                                    style={[
                                        styles.moodGrid,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                >
                                    {MOODS.map((mood) => {
                                        const isSelected = selectedMood === mood.key;
                                        return (
                                            <Pressable
                                                key={mood.key}
                                                onPress={() => {
                                                    triggerHaptic('selection');
                                                    setSelectedMood(
                                                        isSelected ? undefined : mood.key
                                                    );
                                                    setShowMoods(false);
                                                }}
                                                style={[
                                                    styles.moodItem,
                                                    isSelected && {
                                                        backgroundColor: colors.primary + '18',
                                                        borderColor: colors.primary,
                                                        borderWidth: 1.5,
                                                    },
                                                ]}
                                            >
                                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                                <Text
                                                    style={[
                                                        styles.moodLabel,
                                                        {
                                                            color: isSelected
                                                                ? colors.primary
                                                                : colors.textSecondary,
                                                        },
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {t(`moods.${mood.key}`)}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </Animated.View>
                            )}
                        </Animated.View>
                    )}
                </ScrollView>

                {/* Save Button */}
                <View
                    style={[
                        styles.saveContainer,
                        {
                            paddingBottom: Math.max(insets.bottom, spacing.base),
                            backgroundColor: colors.background,
                            borderTopColor: colors.border,
                        },
                    ]}
                >
                    <Pressable
                        onPress={handleSave}
                        style={({ pressed }) => [
                            styles.saveButton,
                            pressed && { transform: [{ scale: 0.97 }] },
                        ]}
                    >
                        <LinearGradient
                            colors={
                                transactionType === 'income'
                                    ? colors.gradientSuccess
                                    : transactionType === 'transfer'
                                        ? [colors.transfer, colors.transfer]
                                        : colors.gradientPrimary
                            }
                            style={styles.saveGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="checkmark" size={22} color="#FFFFFF" />
                            <Text style={styles.saveText}>{t('common.save')}</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        paddingBottom: spacing.sm,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: typography.size.md,
        fontWeight: typography.fontWeight.semibold,
    },
    scrollContent: {
        paddingHorizontal: spacing.screenPaddingH,
        paddingBottom: spacing['2xl'],
    },

    // Type Selector
    typeSelector: {
        flexDirection: 'row',
        borderRadius: borderRadius.xl,
        padding: spacing.xs,
        marginBottom: spacing.xl,
        gap: spacing.xs,
        borderWidth: 1,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    typeLabel: {
        fontSize: typography.size.sm,
    },

    // Amount
    amountSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing['2xl'],
        paddingVertical: spacing.xl,
    },
    currencySymbol: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.fontWeight.medium,
        marginRight: spacing.sm,
    },
    amountInput: {
        fontSize: typography.size['5xl'],
        fontWeight: typography.fontWeight.extrabold,
        textAlign: 'center',
        minWidth: 150,
        padding: 0,
    },

    // Field Button (Category, Wallet, Mood selector)
    fieldButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.md,
        borderWidth: 1,
        gap: spacing.md,
    },
    fieldIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldLabel: {
        flex: 1,
        fontSize: typography.size.base,
        fontWeight: typography.fontWeight.medium,
    },

    // Category Grid
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.md,
        marginTop: -spacing.sm,
        borderWidth: 1,
        gap: spacing.sm,
    },
    categoryItem: {
        width: '30%',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryLabel: {
        fontSize: typography.size.xs,
        textAlign: 'center',
        paddingHorizontal: spacing.xxs,
    },

    // Wallet List
    walletList: {
        borderRadius: borderRadius.xl,
        padding: spacing.sm,
        marginBottom: spacing.md,
        marginTop: -spacing.sm,
        borderWidth: 1,
    },
    walletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.md,
    },
    walletIcon: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletInfo: {
        flex: 1,
    },
    walletName: {
        fontSize: typography.size.base,
        fontWeight: typography.fontWeight.medium,
    },
    walletBalance: {
        fontSize: typography.size.sm,
        marginTop: 2,
    },

    // Note
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.base,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.md,
        borderWidth: 1,
        gap: spacing.sm,
    },
    noteInput: {
        flex: 1,
        fontSize: typography.size.base,
        padding: 0,
        maxHeight: 80,
    },

    // Mood Grid
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.md,
        marginTop: -spacing.sm,
        borderWidth: 1,
        gap: spacing.sm,
    },
    moodItem: {
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.xxs,
        width: '22%',
    },
    moodEmoji: {
        fontSize: 24,
    },
    moodLabel: {
        fontSize: typography.size.xs,
        textAlign: 'center',
    },

    // Save Button
    saveContainer: {
        paddingHorizontal: spacing.screenPaddingH,
        paddingTop: spacing.md,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    saveButton: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    saveGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.base,
        gap: spacing.sm,
    },
    saveText: {
        color: '#FFFFFF',
        fontSize: typography.size.md,
        fontWeight: typography.fontWeight.bold,
    },
});