import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuthStore } from '@/lib/auth-store';
import { vaccinationService } from '@/lib/vaccination-service';

export default function HomeScreen() {
  const user = useAuthStore((state: any) => state.user);
  const isAdmin = useAuthStore((state: any) => state.isAdmin);
  const signOut = useAuthStore((state: any) => state.signOut);
  const fetchUser = useAuthStore((state: any) => state.fetchUser);
  const [vaccinationCount, setVaccinationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeScreen = async () => {
      await fetchUser();
      const vaccinations = await vaccinationService.getAll();
      setVaccinationCount(vaccinations.length);
      setLoading(false);
    };

    initializeScreen();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/(auth)/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerCard}>
        <Text style={styles.greeting}>Welcome back, {user?.display_name || user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={[styles.roleText, isAdmin && styles.roleAdmin]}>
            {isAdmin ? 'Administrator' : 'User'}
          </Text>
        </View>
      </View>

      <Card style={styles.statsCard}>
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>Total Vaccination Types</Text>
          <Text style={styles.statValue}>{vaccinationCount}</Text>
        </View>
      </Card>

      {isAdmin && (
        <Card style={styles.actionCard}>
          <Text style={styles.actionTitle}>Admin Panel</Text>
          <Text style={styles.actionDescription}>You have permission to manage vaccination types</Text>
          <Button
            title="Manage Vaccinations"
            onPress={() => router.push('/(app)/(tabs)/vaccinations')}
            style={styles.actionButton}
          />
        </Card>
      )}

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Account Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={styles.infoValue}>Active</Text>
        </View>
      </Card>

      <Button
        title="View Vaccination Types"
        onPress={() => router.push('/(app)/(tabs)/vaccinations')}
        variant="secondary"
        style={styles.primaryButton}
      />

      <Button
        title="Sign Out"
        onPress={handleLogout}
        variant="ghost"
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />

      <Text style={styles.version}>v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  headerCard: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
  roleAdmin: {
    color: '#10b981',
  },
  statsCard: {
    marginBottom: 16,
    backgroundColor: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
  },
  statContainer: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2563eb',
  },
  actionCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#10b981',
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '600',
  },
  primaryButton: {
    marginBottom: 12,
  },
  logoutButton: {
    marginBottom: 24,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    color: '#ef4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 16,
  },
});
