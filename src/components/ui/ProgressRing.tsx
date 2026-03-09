import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { typography } from '../../constants';
import { useTheme } from '../../theme/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    showPercentage?: boolean;
    children?: React.ReactNode;
    label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 120,
    strokeWidth = 10,
    color,
    backgroundColor,
    showPercentage = true,
    children,
    label,
}) => {
    const { colors } = useTheme();
    const ringColor = color || colors.primary;
    const bgColor = backgroundColor || colors.border;

    const animatedProgress = useSharedValue(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        animatedProgress.value = withTiming(Math.min(progress, 1), {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
        });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - animatedProgress.value);
        return {
            strokeDashoffset,
        };
    });

    const percentage = Math.round(Math.min(progress, 1) * 100);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} style={styles.svg}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={bgColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Animated Progress Circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            <View style={styles.content}>
                {children || (
                    <>
                        {showPercentage && (
                            <Text style={[styles.percentage, { color: colors.text }]}>
                                {percentage}%
                            </Text>
                        )}
                        {label && (
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                {label}
                            </Text>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        position: 'absolute',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentage: {
        fontSize: typography.size.xl,
        fontWeight: typography.fontWeight.bold,
    },
    label: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
});