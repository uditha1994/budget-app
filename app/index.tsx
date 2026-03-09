import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { useTheme } from '../src/theme/ThemeContext';

export default function Index() {
    const router = useRouter();
    const { colors } = useTheme();
    const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted);

    useEffect(() => {
        // Small delay to ensure everything is mounted
        const timer = setTimeout(() => {
            if (onboardingCompleted) {
                router.replace('/(tabs)');
            } else {
                router.replace('/onboarding/welcome');
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [onboardingCompleted]);

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