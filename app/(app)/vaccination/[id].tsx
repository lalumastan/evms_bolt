import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { vaccinationService } from '@/lib/vaccination-service';
import { VaccinationType } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth-store';

export default function VaccinationDetailScreen() {
  const { id } = useLocalSearchParams();
  const isAdmin = useAuthStore((state: any) => state.isAdmin);
  const [vaccination, setVaccination] = useState<VaccinationType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVaccination = async () => {
      if (!id || typeof id !== 'string') return;
      try {
        const data = await vaccinationService.getById(id);
        setVaccination(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load vaccination details');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadVaccination();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!vaccination) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vaccination type not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.button} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card>
        <Text style={styles.title}>{vaccination.title}</Text>
        <Text style={styles.date}>
          Created on {new Date(vaccination.created_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{vaccination.description}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID</Text>
          <Text style={styles.detailValue}>{vaccination.id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Updated</Text>
          <Text style={styles.detailValue}>
            {new Date(vaccination.updated_at).toLocaleDateString()}
          </Text>
        </View>
      </Card>

      {isAdmin && (
        <View style={styles.actionContainer}>
          <Button
            title="Edit"
            onPress={() => router.push(`/(app)/edit-vaccination/${vaccination.id}`)}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Delete"
            onPress={() => {
              Alert.alert('Delete', 'Are you sure?', [
                { text: 'Cancel' },
                {
                  text: 'Delete',
                  onPress: async () => {
                    try {
                      await vaccinationService.delete(vaccination.id);
                      router.replace('/(app)/(tabs)/vaccinations');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to delete');
                    }
                  },
                  style: 'destructive',
                },
              ]);
            }}
            variant="danger"
            style={styles.actionButton}
          />
        </View>
      )}

      <Button
        title="Back"
        onPress={() => router.back()}
        variant="ghost"
        style={styles.backButton}
      />
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '600',
  },
  actionContainer: {
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 0,
  },
  backButton: {
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 24,
  },
  button: {
    alignSelf: 'center',
    minWidth: 120,
  },
});
