import React, { useCallback } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { triggerHaptic } from '../../utils/haptics';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps {
    children: React.ReactNode;
    onPress: () => void;
    style?: ViewStyle | ViewStyle[];
    scaleValue?: number;
    haptic?: boolean;
    disabled?: boolean;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
    children,
    onPress,
    style,
    scaleValue = 0.97,
    haptic = true,
    disabled = false,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(scaleValue, { damping: 15, stiffness: 400 });
    }, [scaleValue]);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, []);

    const handlePress = useCallback(() => {
        if (disabled) return;
        if (haptic) triggerHaptic('selection');
        onPress();
    }, [disabled, haptic, onPress]);

    return (
        <AnimatedPress
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[animatedStyle, style]}
        >
            {children}
        </AnimatedPress>
    );
};