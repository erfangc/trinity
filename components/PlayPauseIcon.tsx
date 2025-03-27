import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {useGregorianChant} from "@/app/GregorianChantContext";

export const PlayPauseIcon = () => {

    const {isPlaying, togglePlayPause} = useGregorianChant();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={30} color="#fff"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-end",
        margin: 16,
    },
});