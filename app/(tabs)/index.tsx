import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { ProgressRing } from '../../src/components/ui/ProgressRing';
import { borderRadius, defaultCategories, spacing, typography } from '../../src/constants';
import { useBudgetStore } from '../../src/stores/useBudgetStore';
import { useGoalStore } from '../../src/stores/useGoalStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useTransactionStore } from '../../src/stores/useTransactionStore';
import { useWalletStore } from '../../src/stores/useWalletStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { Transaction } from '../../src/types';
import { formatDate, getGreetingKey, isToday, isYesterday } from '../../src/utils/dateHelpers';
import { formatCurrency } from '../../src/utils/formatCurrency';
import { triggerHaptic } from '../../src/utils/haptics';

type IoniconsName = keyof typeof Ionicons.glyphMap;

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { userName, currency } = useSettingsStore();

  // Store data
  const totalBalance = useWalletStore((s) => s.getTotalBalance());
  const wallets = useWalletStore((s) => s.wallets);
  const recentTransactions = useTransactionStore((s) => s.getRecentTransactions(5));
  const todayExpense = useTransactionStore((s) => s.getTodayTotal('expense'));
  const todayIncome = useTransactionStore((s) => s.getTodayTotal('income'));
  const activeBudgets = useBudgetStore((s) => s.getActiveBudgets());
  const activeGoals = useGoalStore((s) => s.getActiveGoals());

  // Monthly totals
  const now = new Date();
  const monthlyTotals = useTransactionStore((s) =>
    s.getMonthlyTotals(now.getFullYear(), now.getMonth())
  );

  const greetingKey = getGreetingKey();

  // Get relative date label
  const getDateLabel = (date: string): string => {
    if (isToday(date)) return t('common.today');
    if (isYesterday(date)) return t('common.yesterday');
    return formatDate(date, 'short');
  };

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return defaultCategories.find((c) => c.id === categoryId);
  };

  return (
    <ScreenWrapper scrollable safeAreaEdges={['top']}>
      {/* Header / Greeting */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={styles.header}
      >
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {t(greetingKey)} 👋
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {userName || 'Friend'}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            triggerHaptic('selection');
            router.push('/(tabs)/profile');
          }}
          style={[
            styles.notifButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </Pressable>
      </Animated.View>

      {/* Balance Card */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)}>
        <LinearGradient
          colors={colors.gradientPrimary}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.balanceDecor1} />
          <View style={styles.balanceDecor2} />

          <Text style={styles.balanceLabel}>{t('home.totalBalance')}</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(totalBalance, currency)}
          </Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <View style={[styles.statDot, { backgroundColor: '#4ADE80' }]} />
              <Text style={styles.statLabel}>{t('transactions.income')}</Text>
              <Text style={styles.statAmount}>
                {formatCurrency(monthlyTotals.income, currency, { compact: true })}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceStat}>
              <View style={[styles.statDot, { backgroundColor: '#F87171' }]} />
              <Text style={styles.statLabel}>{t('transactions.expense')}</Text>
              <Text style={styles.statAmount}>
                {formatCurrency(monthlyTotals.expense, currency, { compact: true })}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <View style={styles.quickActions}>
          {[
            {
              icon: 'arrow-down-circle' as IoniconsName,
              label: t('transactions.income'),
              color: colors.income,
              onPress: () => router.push('/add-transaction' as any),
            },
            {
              icon: 'arrow-up-circle' as IoniconsName,
              label: t('transactions.expense'),
              color: colors.expense,
              onPress: () => router.push('/add-transaction' as any),
            },
            {
              icon: 'swap-horizontal' as IoniconsName,
              label: t('transactions.transfer'),
              color: colors.transfer,
              onPress: () => router.push('/add-transaction' as any),
            },
            {
              icon: 'wallet' as IoniconsName,
              label: t('profile.wallets'),
              color: colors.primary,
              onPress: () => { },
            },
          ].map((action) => (
            <Pressable
              key={action.label}
              onPress={() => {
                triggerHaptic('selection');
                action.onPress();
              }}
              style={styles.quickActionItem}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + '15' },
                ]}
              >
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text
                style={[styles.quickActionLabel, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Today's Spending */}
      <Animated.View entering={FadeInDown.delay(400).duration(600)}>
        <GlassCard>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.todaySpending')}
            </Text>
            <Text style={[styles.todayAmount, { color: colors.expense }]}>
              {formatCurrency(todayExpense, currency)}
            </Text>
          </View>
          {todayIncome > 0 && (
            <View style={[styles.sectionRow, { marginTop: spacing.sm }]}>
              <Text style={[styles.todayLabel, { color: colors.textSecondary }]}>
                {t('transactions.income')}
              </Text>
              <Text style={[styles.todayIncomeAmount, { color: colors.income }]}>
                +{formatCurrency(todayIncome, currency)}
              </Text>
            </View>
          )}
        </GlassCard>
      </Animated.View>

      {/* Active Budgets Preview */}
      {activeBudgets.length > 0 && (
        <Animated.View entering={FadeInDown.delay(450).duration(600)}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.monthlyBudget')}
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/planner')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                {t('common.seeAll')}
              </Text>
            </Pressable>
          </View>
          <GlassCard>
            {activeBudgets.slice(0, 3).map((budget) => {
              const category = getCategoryInfo(budget.categoryId);
              const progress = budget.plannedAmount > 0
                ? budget.spentAmount / budget.plannedAmount
                : 0;
              const isOver = budget.spentAmount > budget.plannedAmount;

              return (
                <View key={budget.id} style={styles.budgetItem}>
                  <View
                    style={[
                      styles.budgetIcon,
                      { backgroundColor: (category?.color || colors.primary) + '18' },
                    ]}
                  >
                    <Ionicons
                      name={(category?.icon || 'ellipse') as IoniconsName}
                      size={18}
                      color={category?.color || colors.primary}
                    />
                  </View>
                  <View style={styles.budgetInfo}>
                    <Text style={[styles.budgetName, { color: colors.text }]}>
                      {category ? t(category.nameKey) : 'Budget'}
                    </Text>
                    <View style={styles.budgetBarContainer}>
                      <View
                        style={[
                          styles.budgetBarBg,
                          { backgroundColor: colors.border },
                        ]}
                      >
                        <View
                          style={[
                            styles.budgetBarFill,
                            {
                              width: `${Math.min(progress * 100, 100)}%`,
                              backgroundColor: isOver
                                ? colors.error
                                : progress > 0.8
                                  ? colors.warning
                                  : colors.income,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.budgetAmount,
                      { color: isOver ? colors.error : colors.textSecondary },
                    ]}
                  >
                    {formatCurrency(budget.spentAmount, currency, { compact: true })}
                    {' / '}
                    {formatCurrency(budget.plannedAmount, currency, { compact: true })}
                  </Text>
                </View>
              );
            })}
          </GlassCard>
        </Animated.View>
      )}

      {/* Active Goals Preview */}
      {activeGoals.length > 0 && (
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.savingsProgress')}
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/goals')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                {t('common.seeAll')}
              </Text>
            </Pressable>
          </View>
          <View style={styles.goalsRow}>
            {activeGoals.slice(0, 2).map((goal) => {
              const progress = goal.targetAmount > 0
                ? goal.currentAmount / goal.targetAmount
                : 0;

              return (
                <GlassCard key={goal.id} style={styles.goalCard}>
                  <ProgressRing
                    progress={progress}
                    size={60}
                    strokeWidth={6}
                    color={goal.color}
                    showPercentage={false}
                  >
                    <Text style={{ fontSize: 18 }}>{goal.icon}</Text>
                  </ProgressRing>
                  <Text
                    style={[styles.goalTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {goal.title}
                  </Text>
                  <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
                    {Math.round(progress * 100)}%
                  </Text>
                </GlassCard>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* Recent Transactions */}
      <Animated.View entering={FadeInDown.delay(550).duration(600)}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('home.recentTransactions')}
          </Text>
          {recentTransactions.length > 0 && (
            <Pressable onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                {t('common.seeAll')}
              </Text>
            </Pressable>
          )}
        </View>

        {recentTransactions.length > 0 ? (
          <GlassCard padding={0}>
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                colors={colors}
                currency={currency}
                t={t}
                isLast={index === recentTransactions.length - 1}
              />
            ))}
          </GlassCard>
        ) : (
          <EmptyState
            emoji="📝"
            title={t('home.noTransactions')}
            subtitle={t('home.noTransactionsSubtitle')}
          />
        )}
      </Animated.View>

      {/* Bottom spacing */}
      <View style={{ height: 120 }} />
    </ScreenWrapper>
  );
}

// ============================================================
// TRANSACTION LIST ITEM
// ============================================================

function TransactionItem({
  transaction,
  colors,
  currency,
  t,
  isLast,
}: {
  transaction: Transaction;
  colors: any;
  currency: any;
  t: any;
  isLast: boolean;
}) {
  const category = defaultCategories.find(
    (c) => c.id === transaction.categoryId
  );

  const amountColor =
    transaction.type === 'income'
      ? colors.income
      : transaction.type === 'expense'
        ? colors.expense
        : colors.transfer;

  const amountPrefix = transaction.type === 'income' ? '+' : '-';

  const dateLabel = isToday(transaction.date)
    ? t('common.today')
    : isYesterday(transaction.date)
      ? t('common.yesterday')
      : formatDate(transaction.date, 'short');

  return (
    <View
      style={[
        transactionStyles.container,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
      ]}
    >
      <View
        style={[
          transactionStyles.icon,
          { backgroundColor: (category?.color || colors.primary) + '15' },
        ]}
      >
        <Ionicons
          name={(category?.icon || 'ellipse') as IoniconsName}
          size={20}
          color={category?.color || colors.primary}
        />
      </View>
      <View style={transactionStyles.info}>
        <Text style={[transactionStyles.name, { color: colors.text }]}>
          {category ? t(category.nameKey) : 'Transaction'}
        </Text>
        <Text style={[transactionStyles.meta, { color: colors.textTertiary }]}>
          {dateLabel}
          {transaction.note ? ` · ${transaction.note}` : ''}
        </Text>
      </View>
      <Text style={[transactionStyles.amount, { color: amountColor }]}>
        {amountPrefix}
        {formatCurrency(transaction.amount, currency)}
      </Text>
    </View>
  );
}

const transactionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.medium,
  },
  meta: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  amount: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

// ============================================================
// MAIN STYLES
// ============================================================

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  greeting: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.medium,
  },
  name: {
    fontSize: typography.size.xl,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  // Balance Card
  balanceCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.cardPaddingLg,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  balanceDecor1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -80,
    right: -40,
  },
  balanceDecor2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -60,
    left: -30,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.size.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: typography.size['4xl'],
    fontWeight: typography.fontWeight.extrabold,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.size.sm,
  },
  statAmount: {
    color: '#FFFFFF',
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.semibold,
  },
  balanceDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: spacing.md,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.fontWeight.medium,
  },

  // Section
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.fontWeight.semibold,
  },
  seeAll: {
    fontSize: typography.size.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  todayAmount: {
    fontSize: typography.size.lg,
    fontWeight: typography.fontWeight.bold,
  },
  todayLabel: {
    fontSize: typography.size.sm,
  },
  todayIncomeAmount: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.semibold,
  },

  // Budget Items
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  budgetIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetInfo: {
    flex: 1,
  },
  budgetName: {
    fontSize: typography.size.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  budgetBarContainer: {
    width: '100%',
  },
  budgetBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  budgetBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  budgetAmount: {
    fontSize: typography.size.xs,
  },

  // Goals
  goalsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  goalCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  goalTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  goalAmount: {
    fontSize: typography.size.xs,
    marginTop: spacing.xxs,
  },
});