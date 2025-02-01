import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
}

const GradientButton: React.FC<GradientButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer} activeOpacity={0.8}>
            <LinearGradient
                colors={['#45281E', '#7E4D26']} // Figma gradient colors
                start={{ x: 0.49, y: 0 }} // Matching Figma's gradient
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.text}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 25, // Ensures rounded corners
        overflow: 'hidden', // Prevents gradient overflow
    },
    gradient: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25, // Same as buttonContainer
        alignItems: 'center',
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GradientButton;