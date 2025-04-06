import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {useRouter} from "expo-router";
import {PrayerIntention} from "@/generated-sdk";

export default function Inbox() {

    const router = useRouter();
    const [prayerIntentions, setPrayerIntentions] = useState<PrayerIntention[]>([]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#221F1F"}}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white"/>
            </TouchableOpacity>
            <View style={{marginLeft: 16}}>
                <Text style={{color: '#fff', fontSize: 24, marginTop: 12, fontWeight: 'bold'}}>Inbox</Text>
            </View>
            {
                prayerIntentions.map(prayerIntention =>
                    <TouchableOpacity
                        key={prayerIntention.id}
                        onPress={() => router.push(`/prayer-intentions/${prayerIntention.id}`)}
                        style={
                            {
                                marginHorizontal: 16,
                                marginTop: 24,
                                borderBottomWidth: 1,
                                borderBottomColor: '#fff',
                                paddingBottom: 16,
                            }
                        }
                    >
                        <Text style={{color: '#B3B3B3'}}>"{prayerIntention.intentionText}"</Text>
                    </TouchableOpacity>
                )
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 16,
    },
});