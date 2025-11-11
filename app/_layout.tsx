import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '@/lib/auth-store';

export default function RootLayout() {
  useFrameworkReady();
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state: any) => state.user);
  const fetchUser = useAuthStore((state: any) => state.fetchUser);

  useEffect(() => {
    fetchUser().then(() => setMounted(true));
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="(app)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
