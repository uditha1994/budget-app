import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SectionList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useTheme } from '../../src/theme/ThemeContext';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useTransactionStore } from '../../src/stores/useTransactionStore';
import { useWalletStore } from '../../src/stores/useWalletStore';
import { useBudgetStore } from '../../src/stores/useBudgetStore';
import {
  spacing,
  typography,
  borderRadius,
  defaultCategories,
} from '../../src/constants';
import { formatDate, isToday, isYesterday } from '../../src/utils/dateHelpers';
import { formatCurrency } from '../../src/utils/formatCurrency';
import { triggerHaptic } from '../../src/utils/haptics';
import { Transaction, TransactionType } from '../../src/types';

type IoniconsName = keyof typeof Ionicons.glyphMap;
type FilterType = 'all' | TransactionType;

interface TransactionSection {
  title: string;
  data: Transaction[];
  totalIncome: number;
  totalExpense: number;
}

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { currency } = useSettingsStore();

  const transactions = useTransactionStore((s) => s.transactions);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);
  const updateBalance = useWalletStore((s) => s.updateBalance);

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.type === activeFilter);
    }
    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, activeFilter]);

  // Group by date into sections
  const sections: TransactionSection[] = useMemo(() => {
    const grouped: Record<string, Transaction[]> = {};

    filteredTransactions.forEach((t) => {
      const dateKey = t.date.substring(0, 10);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(t);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateKey, items]) => {
        const totalIncome = items
          .filter((i) => i.type === 'income')
          .reduce((s, i) => s + i.amount, 0);
        const totalExpense = items
          .filter((i) => i.type === 'expense')
          .reduce((s, i) => s + i.amount, 0);

        let title: string;
        if (isToday(dateKey)) {
          title = t('common.today');
        } else if (isYesterday(dateKey)) {
          title = t('common.yesterday');
        } else {
          title = formatDate(dateKey, 'medium');
        }

        return { title, data: items, totalIncome, totalExpense };
      });
  }, [filteredTransactions, t]);

  const handleDelete = useCallback(
    (transaction: Transaction) => {
      Alert.alert(
        t('transactions.deleteConfirm'),
        t('transactions.deleteMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.delete'),
            style: 'destructive',
            onPress: () => {
              triggerHaptic('warning');
              // Reverse balance change
              if (transaction.type === 'expense') {
                updateBalance(transaction.walletId, transaction.amount);
              } else if (transaction.type === 'income') {
                updateBalance(transaction.walletId, -transaction.amount);
              }
              deleteTransaction(transaction.id);
            },
          },
        ]
      );
    },
    [t]
  );

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('transactions.allCategories') },
    { key: 'expense', label: t('transactions.expense') },
    { key: 'income', label: t('transactions.income') },
    { key: 'transfer', label: t('transactions.transfer') },
  ];

  const renderSectionHeader = ({
    section,
  }: {
    section: TransactionSection;
  }) => (
    <View
      style={[
        styles.sectionHeader,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {section.title}
      </Text>
      <View style={styles.sectionTotals}>
        {section.totalIncome > 0 && (
          <Text style={[styles.sectionTotal, { color: colors.income }]}>
            +{formatCurrency(section.totalIncome, currency, { compact: true })}
          </Text>
        )}
        {section.totalExpense > 0 && (
          <Text style={[styles.sectionTotal, { color: colors.expense }]}>
            -{formatCurrency(section.totalExpense, currency, { compact: true })}
          </Text>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Transaction }) => {
    const category = defaultCategories.find(
      (c) => c.id === item.categoryId
    );
    const amountColor =
      item.type === 'income'
        ? colors.income
        : item.type === 'expense'
        ? colors.expense
        : colors.transfer;
    const prefix = item.type === 'income' ? '+' : '-';

    return (
      <Pressable
        onLongPress={() => handleDelete(item)}
        style={({ pressed }) => [
          styles.transactionItem,
          {
            backgroundColor: pressed
              ? colors.backgroundSecondary
              : 'transparent',
          },
        ]}
      >
        <View
          style={[
            styles.transactionIcon,
            { backgroundColor: (category?.color || colors.primary) + '15' },
          ]}
        >
          <Ionicons
            name={(category?.icon || 'ellipse') as IoniconsName}
            size={20}
            color={category?.color || colors.primary}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={[styles.transactionName, { color: colors.text }]}>
            {category ? t(category.nameKey) : 'Transaction'}
          </Text>
          <Text
            style={[
              styles.transactionMeta,
              { color: colors.textTertiary },
            ]}
            numberOfLines={1}
          >
            {item.note || formatDate(item.date, 'short')}
            {item.mood && ` · ${item.mood}`}
          </Text>
        </View>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          {prefix}{formatCurrency(item.amount, currency)}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScreenWrapper safeAreaEdges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          {t('transactions.title')}
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <Pressable
                key={filter.key}
                onPress={() => {
                  triggerHaptic('selection');
                  setActiveFilter(filter.key);
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.surface,
                    borderColor: isActive
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    {
                      color: isActive
                        ? '#FFFFFF'
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </Animated.ScrollView>
      </View>

      {/* Transaction List */}
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            emoji="💳"
            title={t('empty.transactions.title')}
            subtitle={t('empty.transactions.subtitle')}
            actionLabel={t('transactions.addExpense')}
            onAction={() => router.push('/add-transaction' as any)}
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingVertical: spacing.md,
  },
  pageTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.fontWeight.bold,
  },

  // Filters
  filterContainer: {
    marginBottom: spacing.md,
  },
  filterScroll: {
    paddingHorizontal: spacing.screenPaddingH,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPaddingH,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  sectionTotals: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sectionTotal: {
    fontSize: typography.size.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  // Transaction Item
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.screenPaddingH,
    gap: spacing.md,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.medium,
  },
  transactionMeta: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.bold,
  },

  // List
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});