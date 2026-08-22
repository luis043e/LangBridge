import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: {
          backgroundColor: '#050B24',
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />

      <Stack.Screen
        name="(tabs)"
        options={{
          animation: 'none',
        }}
      />

      <Stack.Screen name="language-profile" />
      <Stack.Screen name="choose-language" />
    </Stack>
  );
}
