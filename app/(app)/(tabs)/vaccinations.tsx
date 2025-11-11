import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Plus, Trash2, ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuthStore } from '@/lib/auth-store';
import { vaccinationService } from '@/lib/vaccination-service';
import { VaccinationType } from '@/lib/supabase';

export default function VaccinationsScreen() {
  const user = useAuthStore((state: any) => state.user);
  const isAdmin = useAuthStore((state: any) => state.isAdmin);
  const [vaccinations, setVaccinations] = useState<VaccinationType[]>([]);
  const [filteredVaccinations, setFilteredVaccinations] = useState<VaccinationType[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVaccinations = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const data = await vaccinationService.getAll();
      setVaccinations(data);
      setFilteredVaccinations(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load vaccination types');
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadVaccinations();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const filtered = vaccinations.filter((v) =>
        v.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredVaccinations(filtered);
    } else {
      setFilteredVaccinations(vaccinations);
    }
  }, [search, vaccinations]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Delete Vaccination Type', `Are you sure you want to delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await vaccinationService.delete(id);
            setVaccinations((prev) => prev.filter((v) => v.id !== id));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete vaccination type');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderVaccinationItem = ({ item }: { item: VaccinationType }) => (
    <Pressable onPress={() => router.push(`/(app)/vaccination/${item.id}`)}>
      <Card style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <View style={styles.itemTitleContainer}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.itemDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <ChevronRight color="#9ca3af" size={20} />
        </View>

        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {isAdmin && (
          <View style={styles.itemActions}>
            <Button
              title="Edit"
              onPress={() => router.push(`/(app)/edit-vaccination/${item.id}`)}
              variant="secondary"
              size="sm"
              style={styles.editButton}
            />
            <Button
              title="Delete"
              onPress={() => handleDelete(item.id, item.title)}
              variant="danger"
              size="sm"
              style={styles.deleteButton}
            />
          </View>
        )}
      </Card>
    </Pressable>
  );

  const emptyState = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Vaccination Types</Text>
      <Text style={styles.emptyText}>
        {isAdmin
          ? 'Get started by creating your first vaccination type'
          : 'No vaccination types available yet'}
      </Text>
      {isAdmin && (
        <Button
          title="Create First Type"
          onPress={() => router.push('/(app)/create-vaccination')}
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search vaccination types..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
        />
        {isAdmin && (
          <Button
            title="Add New"
            onPress={() => router.push('/(app)/create-vaccination')}
            variant="secondary"
            size="sm"
            style={styles.addButton}
          />
        )}
      </View>

      {filteredVaccinations.length === 0 ? (
        emptyState
      ) : (
        <FlatList
          data={filteredVaccinations}
          renderItem={renderVaccinationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              loadVaccinations(false);
            }} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    color: '#1f2937',
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  itemDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 160,
  },
});
