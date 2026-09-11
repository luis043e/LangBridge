import { StyleSheet, Text, View } from "react-native";

export default function LegalPage() {
 return (
 <View style={styles.container}>
 <Text style={styles.title}>Eliminación de cuenta</Text>
 </View>
 );
}

const styles = StyleSheet.create({
 container: {
 flex: 1,
 alignItems: "center",
 justifyContent: "center",
 backgroundColor: "#050B24",
 padding: 24,
 },
 title: {
 color: "#FFFFFF",
 fontSize: 28,
 fontWeight: "800",
 textAlign: "center",
 },
});
