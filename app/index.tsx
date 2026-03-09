import { useRootNavigationState, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { useTheme } from '../src/theme/ThemeContext';

export default function Index() {
    const router = useRouter();
    const { colors } = useTheme();
    const navigationState = useRootNavigationState();
    const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted);
    const [hasNavigated, setHasNavigated] = useState(false);

    useEffect(() => {
        // Wait until navigation is ready before redirecting
        if (!navigationState?.key) return;
        if (hasNavigated) return;

        setHasNavigated(true);

        // Use requestAnimationFrame to ensure layout is complete
        requestAnimationFrame(() => {
            if (onboardingCompleted) {
                router.replace('/(tabs)');
            } else {
                router.replace('/onboarding/welcome');
            }
        });
    }, [navigationState?.key, onboardingCompleted, hasNavigated]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});