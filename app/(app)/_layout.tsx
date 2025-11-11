import { Tabs } from 'expo-router';
import { Home, Syringe } from 'lucide-react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="(tabs)/home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: 'EVMS',
        }}
      />
      <Tabs.Screen
        name="(tabs)/vaccinations"
        options={{
          title: 'Vaccinations',
          tabBarLabel: 'Vaccinations',
          tabBarIcon: ({ color, size }) => <Syringe color={color} size={size} />,
          headerTitle: 'Vaccination Types',
        }}
      />
    </Tabs>
  );
}
