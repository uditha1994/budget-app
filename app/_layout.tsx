import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../src/i18n';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';

// Keep splash screen visible while we load
SplashScreen.preventAutoHideAsync().catch(() => {
  // Handle error silently - splash screen might already be hidden
});

function RootNavigation() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="onboarding"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="add-transaction"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [storeHydrated, setStoreHydrated] = useState(false);

  useEffect(() => {
    // Listen for Zustand store rehydration
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      setStoreHydrated(true);
    });

    // Check if already hydrated (can happen if storage is fast)
    if (useSettingsStore.persist.hasHydrated()) {
      setStoreHydrated(true);
    }

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (storeHydrated) {
      setIsReady(true);
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [storeHydrated]);

  if (!isReady) {
    // Return empty view while loading - splash screen covers this
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}