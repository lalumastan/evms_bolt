import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { vaccinationService } from '@/lib/vaccination-service';
import { VaccinationType } from '@/lib/supabase';

export default function EditVaccinationScreen() {
  const { id } = useLocalSearchParams();
  const [vaccination, setVaccination] = useState<VaccinationType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadVaccination = async () => {
      if (!id || typeof id !== 'string') return;
      try {
        const data = await vaccinationService.getById(id);
        setVaccination(data);
        setTitle(data.title);
        setDescription(data.description);
      } catch (error) {
        Alert.alert('Error', 'Failed to load vaccination');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadVaccination();
  }, [id]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !vaccination) return;

    setSaving(true);
    try {
      await vaccinationService.update(vaccination.id, description);
      Alert.alert('Success', 'Vaccination type updated successfully');
      router.replace(`/(app)/vaccination/${vaccination.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update vaccination';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Edit Vaccination Type</Text>
          <Text style={styles.subtitle}>Update vaccination type details</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.readOnlyContainer}>
            <Text style={styles.label}>Title (Cannot be changed)</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{title}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.descriptionInput, errors.description && styles.inputError]}
              placeholder="Enter vaccination description"
              value={description}
              onChangeText={setDescription}
              editable={!saving}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.charCountContainer}>
              <Text style={styles.charCount}>
                {description.length} / 500 characters
              </Text>
            </View>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={saving}
              style={styles.submitButton}
            />
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="ghost"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  formContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1f2937',
  },
  readOnlyContainer: {
    marginBottom: 16,
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
  },
  readOnlyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    height: 120,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: 6,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 24,
  },
  submitButton: {
    marginBottom: 0,
  },
  cancelButton: {
    marginBottom: 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
    minWidth: 120,
  },
});
