import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LangBridge</Text>
      <Text style={styles.subtitle}>Practice. Connect. Grow.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#A7F3D0',
    fontSize: 18,
    marginTop: 12,
  },
});