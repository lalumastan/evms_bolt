import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuthStore } from '@/lib/auth-store';
import { vaccinationService } from '@/lib/vaccination-service';

export default function CreateVaccinationScreen() {
  const user = useAuthStore((state: any) => state.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate() || !user) return;

    setLoading(true);
    try {
      await vaccinationService.create(title, description, user.id);
      Alert.alert('Success', 'Vaccination type created successfully');
      router.replace('/(app)/(tabs)/vaccinations');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create vaccination type';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Vaccination Type</Text>
          <Text style={styles.subtitle}>Add a new vaccination type to the system</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Title"
            placeholder="e.g., COVID-19"
            value={title}
            onChangeText={setTitle}
            editable={!loading}
            error={errors.title}
          />

          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.descriptionInput, errors.description && styles.inputError]}
              placeholder="Enter vaccination description"
              value={description}
              onChangeText={setDescription}
              editable={!loading}
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
              title="Create"
              onPress={handleCreate}
              loading={loading}
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
});
