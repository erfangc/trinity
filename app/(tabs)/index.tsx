import {ImageBackground, StyleSheet, View} from 'react-native';
import GradientButton from "@/components/ui/GradientButton";

export default function HomeScreen() {
  return (
    <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.background}
        resizeMode="cover" // or "contain" depending on your design
    >
      <View style={styles.overlay}>
        <GradientButton title={"Request"} onPress={() => null}/>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: Adds a semi-transparent overlay
  },
});
