import { Tabs } from 'expo-router';

import AppTabs from '../../components/app-tabs';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <AppTabs />}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        lazy: false,
        sceneStyle: {
          backgroundColor: '#050B24',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
        }}
      />

      <Tabs.Screen
        name="conversations"
        options={{
          title: 'Chats',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
