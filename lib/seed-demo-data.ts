import { supabase } from './supabase';

const DEMO_VACCINATIONS = [
  {
    title: 'COVID-19',
    description: 'COVID-19 vaccine helps protect against severe illness and death from SARS-CoV-2 virus. Recommended for all individuals 6 months and older.',
  },
  {
    title: 'Influenza (Flu)',
    description: 'Annual flu vaccine provides protection against seasonal influenza viruses. Recommended yearly for most people 6 months and older.',
  },
  {
    title: 'Measles, Mumps, Rubella (MMR)',
    description: 'MMR vaccine protects against three highly contagious diseases. Typically given in two doses during childhood.',
  },
  {
    title: 'Tetanus, Diphtheria, Pertussis (Tdap)',
    description: 'Tdap vaccine protects against tetanus, diphtheria, and pertussis. Booster recommended every 10 years for adults.',
  },
  {
    title: 'Hepatitis B',
    description: 'Hepatitis B vaccine prevents infection with the hepatitis B virus. Recommended for infants and unvaccinated adults.',
  },
];

export async function seedDemoData() {
  try {
    // Get or create admin user
    const { data: authData } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'password123',
    });

    if (authData.user) {
      const { data: existingAdmin } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'admin@example.com')
        .single();

      if (!existingAdmin) {
        await supabase.from('users').insert({
          id: authData.user.id,
          email: 'admin@example.com',
          display_name: 'Admin User',
          role: 'admin',
        });
      }

      // Create demo vaccination types
      for (const vac of DEMO_VACCINATIONS) {
        const { data: existing } = await supabase
          .from('vaccination_types')
          .select('id')
          .eq('title', vac.title)
          .maybeSingle();

        if (!existing) {
          await supabase.from('vaccination_types').insert({
            title: vac.title,
            description: vac.description,
            created_by: authData.user.id,
          });
        }
      }
    }

    // Create regular user
    const { data: userData } = await supabase.auth.signUp({
      email: 'user@example.com',
      password: 'password123',
    });

    if (userData.user) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'user@example.com')
        .single();

      if (!existingUser) {
        await supabase.from('users').insert({
          id: userData.user.id,
          email: 'user@example.com',
          display_name: 'Demo User',
          role: 'user',
        });
      }
    }

    console.log('Demo data seeded successfully');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}
