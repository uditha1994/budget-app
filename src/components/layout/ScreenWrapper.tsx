import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../constants';
import { useTheme } from '../../theme/ThemeContext';

interface ScreenWrapperProps {
    children: React.ReactNode;
    scrollable?: boolean;
    padding?: boolean;
    style?: ViewStyle;
    contentStyle?: ViewStyle;
    safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    scrollable = false,
    padding = true,
    style,
    contentStyle,
    safeAreaEdges = ['top'],
}) => {
    const { colors, isDark } = useTheme();

    const content = scrollable ? (
        <ScrollView
            style={styles.flex}
            contentContainerStyle={[
                padding && styles.padding,
                contentStyle,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {children}
        </ScrollView>
    ) : (
        <View style={[styles.flex, padding && styles.padding, contentStyle]}>
            {children}
        </View>
    );

    return (
        <SafeAreaView
            edges={safeAreaEdges}
            style={[
                styles.flex,
                { backgroundColor: colors.background },
                style,
            ]}
        >
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            {content}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    padding: {
        paddingHorizontal: spacing.screenPaddingH,
    },
});