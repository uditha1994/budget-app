import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { layout, shadows } from '../../src/constants';
import { useTheme } from '../../src/theme/ThemeContext';
import { triggerHaptic } from '../../src/utils/haptics';

type IoniconsName = keyof typeof Ionicons.glyphMap;

const TabIcon = ({
  name,
  focused,
  color,
}: {
  name: IoniconsName;
  focused: boolean;
  color: string;
}) => {
  return <Ionicons name={name} size={focused ? 26 : 24} color={color} />;
};

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarStyle: {
            backgroundColor: isDark ? colors.tabBar : colors.tabBar,
            borderTopColor: colors.border,
            borderTopWidth: isDark ? 0 : StyleSheet.hairlineWidth,
            height: layout.tabBarHeight,
            paddingBottom: Platform.OS === 'ios' ? 24 : 8,
            paddingTop: 8,
            ...(isDark ? {} : shadows.sm),
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: t('tabs.transactions'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'} focused={focused} color={color} />
            ),
          }}
        />
        {/* Spacer for FAB */}
        <Tabs.Screen
          name="add-placeholder"
          options={{
            title: '',
            tabBarIcon: () => <View style={{ width: 60 }} />,
            tabBarLabel: () => null,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              // Will open add transaction modal
            },
          }}
        />
        <Tabs.Screen
          name="planner"
          options={{
            title: t('tabs.planner'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: t('tabs.goals'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={focused ? 'flag' : 'flag-outline'} focused={focused} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Floating Action Button */}
      <Pressable
        style={[styles.fabContainer]}
        onPress={() => {
          triggerHaptic('medium');
          // Will navigate to add transaction
        }}
      >
        <LinearGradient
          colors={colors.gradientPrimary}
          style={[styles.fab, shadows.glow(colors.primary)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    alignSelf: 'center',
    zIndex: 999,
  },
  fab: {
    width: layout.fabSize,
    height: layout.fabSize,
    borderRadius: layout.fabSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});