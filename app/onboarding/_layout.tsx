import { Stack } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';

export default function OnboardingLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="welcome" />
            <Stack.Screen name="language" />
            <Stack.Screen name="currency" />
            <Stack.Screen name="setup-complete" />
        </Stack>
    );
}