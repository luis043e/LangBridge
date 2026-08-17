import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="language-profile" />
      <Stack.Screen name="choose-language" />
    </Stack>
  );
}