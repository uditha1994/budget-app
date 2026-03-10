import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadows } from '../../src/constants';
import { useTheme } from '../../src/theme/ThemeContext';
import { triggerHaptic } from '../../src/utils/haptics';
import { useRouter } from 'expo-router';

type IoniconsName = keyof typeof Ionicons.glyphMap;

const FAB_SIZE = 52;

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Bottom padding - respect Android navigation bar
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <View style={styles.container}>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar
            {...props}
            colors={colors}
            isDark={isDark}
            bottomPadding={bottomPadding}
            t={t}
          />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="transactions" />
        <Tabs.Screen name="planner" />
        <Tabs.Screen name="goals" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen
          name="add-placeholder"
          options={{ href: null }}
        />
      </Tabs>
    </View>
  );
}

// ============================================================
// CUSTOM TAB BAR COMPONENT
// ============================================================

interface TabConfig {
  name: string;
  label: string;
  iconActive: IoniconsName;
  iconInactive: IoniconsName;
}

function CustomTabBar({
  state,
  navigation,
  colors,
  isDark,
  bottomPadding,
  t,
}: any) {
  const tabs: TabConfig[] = [
    {
      name: 'index',
      label: t('tabs.home'),
      iconActive: 'home',
      iconInactive: 'home-outline',
    },
    {
      name: 'transactions',
      label: t('tabs.transactions'),
      iconActive: 'swap-horizontal',
      iconInactive: 'swap-horizontal-outline',
    },
    {
      name: 'planner',
      label: t('tabs.planner'),
      iconActive: 'calendar',
      iconInactive: 'calendar-outline',
    },
    {
      name: 'goals',
      label: t('tabs.goals'),
      iconActive: 'flag',
      iconInactive: 'flag-outline',
    },
    {
      name: 'profile',
      label: t('tabs.profile'),
      iconActive: 'person',
      iconInactive: 'person-outline',
    },
  ];

  // Filter only visible routes (exclude add-placeholder)
  const visibleRoutes = state.routes.filter(
    (route: any) => route.name !== 'add-placeholder'
  );

  return (
    <View
      style={[
        tabBarStyles.container,
        {
          backgroundColor: isDark ? colors.tabBar : colors.tabBar,
          borderTopColor: isDark ? 'transparent' : colors.border,
          paddingBottom: bottomPadding,
        },
        !isDark && shadows.sm,
      ]}
    >
      {/* Tab Items Row */}
      <View style={tabBarStyles.tabRow}>
        {/* First 2 tabs */}
        {visibleRoutes.slice(0, 2).map((route: any, index: number) => {
          const tab = tabs[index];
          if (!tab) return null;
          const isFocused = state.index === state.routes.indexOf(route);
          return (
            <TabItem
              key={route.key}
              tab={tab}
              isFocused={isFocused}
              colors={colors}
              onPress={() => {
                triggerHaptic('selection');
                if (!isFocused) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}

        {/* FAB in center */}
        <View style={tabBarStyles.fabWrapper}>
          <Pressable
            onPress={() => {
              triggerHaptic('medium');
              navigation.navigate('add-transaction');
              // router.push('/add-transaction');
            }}
            style={({ pressed }) => [
              tabBarStyles.fabPressable,
              pressed && { transform: [{ scale: 0.9 }] },
            ]}
          >
            <LinearGradient
              colors={colors.gradientPrimary}
              style={[tabBarStyles.fab, shadows.glow(colors.primary)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="add" size={26} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Last 3 tabs */}
        {visibleRoutes.slice(2, 5).map((route: any, index: number) => {
          const tabIndex = index + 2;
          const tab = tabs[tabIndex];
          if (!tab) return null;
          const isFocused = state.index === state.routes.indexOf(route);
          return (
            <TabItem
              key={route.key}
              tab={tab}
              isFocused={isFocused}
              colors={colors}
              onPress={() => {
                triggerHaptic('selection');
                if (!isFocused) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// INDIVIDUAL TAB ITEM
// ============================================================

function TabItem({
  tab,
  isFocused,
  colors,
  onPress,
}: {
  tab: TabConfig;
  isFocused: boolean;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={tabBarStyles.tabItem}
      android_ripple={{
        color: colors.primary + '20',
        borderless: true,
        radius: 30,
      }}
    >
      {/* Active indicator dot */}
      {isFocused && (
        <View
          style={[
            tabBarStyles.activeIndicator,
            { backgroundColor: colors.primary },
          ]}
        />
      )}

      <Ionicons
        name={isFocused ? tab.iconActive : tab.iconInactive}
        size={22}
        color={isFocused ? colors.primary : colors.tabBarInactive}
      />

      <Text
        style={[
          tabBarStyles.tabLabel,
          {
            color: isFocused ? colors.primary : colors.tabBarInactive,
            fontWeight: isFocused ? '700' : '500',
          },
        ]}
        numberOfLines={1}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const tabBarStyles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    paddingHorizontal: 4,
  },
  fabPressable: {
    transform: [{ scale: 1 }],
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});