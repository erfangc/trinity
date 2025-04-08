import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Modalize} from "react-native-modalize";
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

    const bottomSheetRef = useRef<Modalize>(null);

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
            bottomSheetRef.current?.close();
        }
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => bottomSheetRef.current?.open()}
                style={styles.triggerBottom}
            >
                <Text style={styles.textNormal}>
                    {selected ? selected.name : 'Select a Church'}
                </Text>
                <Ionicons name="caret-down" color="white"/>
            </TouchableOpacity>
            <Modalize
                ref={bottomSheetRef}
                modalStyle={{backgroundColor: "#333"}}
            >
                <View style={styles.bottomSheetContainer}>
                    <TextInputField
                        label="Search"
                        placeholder="e.g. St Gabriel the Archangel"
                        value={''}
                        onChangeText={() => null}
                        placeholderTextColor="#888"
                    />

                    <ScrollView style={{marginTop: 16}}>
                        {
                            churches.map(church => (
                                <TouchableOpacity
                                    style={{marginLeft: 10}}
                                    key={church.id}
                                    onPress={() => selectChurch(church)}
                                >
                                    <Text style={styles.textNormal}>{church.name}</Text>
                                    <Text style={{...styles.textNormal, color: '#939393'}}>{church.vicinity}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </Modalize>
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
    bottomSheetContainer: {
        padding: 16,
        backgroundColor: "#333",
        flex: 1,
    },
});