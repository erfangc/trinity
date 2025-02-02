import {StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";

export const TextInputField: React.FC<
    { label: string, value: string, onChangeText: (_: string) => void, placeholder?: string }> = (
    {onChangeText, value, label, placeholder}
) => {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#B0B0B0"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: "#3A3A3A",
        paddingHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 4,
        textAlignVertical: "top", // Ensures text aligns properly in multiline mode
    },
    label: {
        color: '#fff'
    },
});