import { Stack } from 'expo-router';

import { LanguageProvider } from '../contexts/language-context';
export default function RootLayout() {
  return (
  <LanguageProvider>
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
  </LanguageProvider>
);
}
