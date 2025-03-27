import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
}

const CtaButton: React.FC<GradientButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer} activeOpacity={0.8}>
            <LinearGradient
                colors={['#45281E', '#7E4D26']}
                start={{ x: 0.49, y: 0 }}
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
        width: '100%',
        height: 62,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    text: {
        color: '#B1AA91',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CtaButton;