import { supabase, VaccinationType } from './supabase';

export const vaccinationService = {
  async getAll(): Promise<VaccinationType[]> {
    const { data, error } = await supabase
      .from('vaccination_types')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<VaccinationType> {
    const { data, error } = await supabase
      .from('vaccination_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(
    title: string,
    description: string,
    createdBy: string
  ): Promise<VaccinationType> {
    const { data, error } = await supabase
      .from('vaccination_types')
      .insert([{ title, description, created_by: createdBy }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    description: string
  ): Promise<VaccinationType> {
    const { data, error } = await supabase
      .from('vaccination_types')
      .update({ description, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('vaccination_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async search(query: string): Promise<VaccinationType[]> {
    const { data, error } = await supabase
      .from('vaccination_types')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('vaccination_types')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vaccination_types' },
        callback
      )
      .subscribe();
  },
};
