import React, { forwardRef } from "react";
import { StyleSheet, Text, TextInput, View, TextInputProps } from "react-native";

type TextInputFieldProps = {
    label: string;
} & TextInputProps;

export const TextInputField = forwardRef<TextInput, TextInputFieldProps>(
    ({ label, style, ...props }, ref) => {
        return (
            <View>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    ref={ref}
                    placeholderTextColor={'#B0B0B0'}
                    style={[styles.textInput, style]}
                    {...props}
                />
            </View>
        );
    }
);

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: "#3A3A3A",
        paddingHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 10,
        color: "#fff",
        borderRadius: 4,
        textAlignVertical: "top",
    },
    label: {
        color: "#fff",
    },
});