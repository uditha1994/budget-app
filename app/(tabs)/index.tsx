// ============================================================
// HOME SCREEN (Tab 1)
// Dashboard with greeting, balance, recent transactions
// ============================================================

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { borderRadius, spacing, typography } from '../../src/constants';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useTheme } from '../../src/theme/ThemeContext';
import { getGreetingKey } from '../../src/utils/dateHelpers';
import { formatCurrency } from '../../src/utils/formatCurrency';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { userName, currency } = useSettingsStore();
  const greetingKey = getGreetingKey();

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
        <View style={[styles.notifButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </View>
      </Animated.View>

      {/* Balance Card */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)}>
        <LinearGradient
          colors={colors.gradientPrimary}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative circle */}
          <View style={styles.balanceDecor1} />
          <View style={styles.balanceDecor2} />

          <Text style={styles.balanceLabel}>{t('home.totalBalance')}</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(0, currency)}
          </Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <View style={[styles.statDot, { backgroundColor: '#4ADE80' }]} />
              <Text style={styles.statLabel}>{t('transactions.income')}</Text>
              <Text style={styles.statAmount}>
                {formatCurrency(0, currency, { compact: true })}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceStat}>
              <View style={[styles.statDot, { backgroundColor: '#F87171' }]} />
              <Text style={styles.statLabel}>{t('transactions.expense')}</Text>
              <Text style={styles.statAmount}>
                {formatCurrency(0, currency, { compact: true })}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <View style={styles.quickActions}>
          {[
            { icon: 'arrow-down-circle' as const, label: t('transactions.income'), color: colors.income },
            { icon: 'arrow-up-circle' as const, label: t('transactions.expense'), color: colors.expense },
            { icon: 'swap-horizontal-circle' as const, label: t('transactions.transfer'), color: colors.transfer },
            { icon: 'wallet' as const, label: t('profile.wallets'), color: colors.primary },
          ].map((action) => (
            <View key={action.label} style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {action.label}
              </Text>
            </View>
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
              {formatCurrency(0, currency)}
            </Text>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Recent Transactions */}
      <Animated.View entering={FadeInDown.delay(500).duration(600)}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('home.recentTransactions')}
          </Text>
          <Text style={[styles.seeAll, { color: colors.primary }]}>
            {t('common.seeAll')}
          </Text>
        </View>

        <EmptyState
          emoji="📝"
          title={t('home.noTransactions')}
          subtitle={t('home.noTransactionsSubtitle')}
        />
      </Animated.View>

      {/* Bottom spacing for tab bar */}
      <View style={{ height: 100 }} />
    </ScreenWrapper>
  );
}

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
});