import {Animated, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {TextInputField} from "@/components/TextInputField";
import {Church} from "@/generated-sdk";
import {api} from "@/sdk";
import {Ionicons} from "@expo/vector-icons";

interface Props {
    churchId?: number;
    onChange: (churchId: number) => void;
}

export default function ChurchSelector({churchId, onChange}: Props) {

    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<Church>();
    const [churches, setChurches] = useState<Church[]>([]);

    useEffect(() => {
        if (churchId) {
            api
                .getChurch(churchId)
                .then(resp => setSelected(resp.data));
        }
    }, [churchId]);

    useEffect(() => {
        api
            .getChurches()
            .then(resp => {
                setChurches(resp.data);
            });
    }, []);

    const selectChurch = async (church: Church) => {
        if (church.id) {
            onChange(church.id);
            setVisible(false);
        }
    };

    const translateY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                console.log(
                    "onMoveShouldSetPanResponder",
                    gestureState.dy,
                    Math.abs(gestureState.dy) > 5
                )
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                console.log("onPanResponderMove", gestureState.dy)
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                console.log("onPanResponderRelease", gestureState.dy)
                if (gestureState.dy > 100) {
                    // Animate out
                    Animated.timing(translateY, {
                        toValue: 1000,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        setVisible(false);
                        translateY.setValue(0); // Reset for next time
                    });
                } else {
                    // Animate back
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;


    return (
        <>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={styles.triggerBottom}
            >
                <Text style={styles.textNormal}>
                    {selected ? selected.name : 'Select a Church'}
                </Text>
                <Ionicons name="caret-down" color="white"/>
            </TouchableOpacity>

            {/* Modal content */}
            <Modal
                visible={visible}
                animationType="none"
                transparent={true}
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.backdrop}>
                    <Animated.View
                        style={[styles.modal, {transform: [{translateY}]}]}
                    >
                        {/* This is the only part that is touchable for dragging */}
                        <View style={styles.dragHandleArea} {...panResponder.panHandlers}>
                            <TouchableOpacity style={styles.dragHandle}/>
                        </View>

                        <TextInputField
                            label="Search"
                            placeholder="e.g. St Gabriel the Archangel"
                            value={''}
                            onChangeText={() => null}
                            placeholderTextColor="#888"
                        />
                        <View style={{marginTop: 16}}>
                            {
                                churches.map(church => (
                                    <TouchableOpacity
                                        style={{marginLeft: 10}}
                                        key={church.id}
                                        onPress={() => selectChurch(church)}
                                    >
                                        <Text style={styles.textNormal}>{church.name}</Text>
                                        <Text style={{
                                            ...styles.textNormal,
                                            color: '#939393'
                                        }}>{church.vicinity}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </>

    );
}

const styles = StyleSheet.create({
    triggerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "#3A3A3A",
        paddingHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 4,
    },
    textNormal: {
        color: "white",
        fontSize: 14,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dragHandleArea: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dragHandle: {
        width: 40,
        height: 8,
        borderRadius: 3,
        backgroundColor: '#999',
    },
    modal: {
        width: '100%',
        flex: 1,
        marginTop: 100,
        backgroundColor: '#333',
        padding: 20,
    },
});