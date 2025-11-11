# EVMS Mobile App - Setup & Getting Started

## Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the App
- **Web Browser**: Press `w` to open in your web browser
- **iOS Simulator**: Press `i` (Mac only)
- **Android Emulator**: Press `a`
- **Physical Device**: Scan the QR code with Expo Go app

## Demo Accounts

The app is pre-configured with demo accounts. Use these to test:

### Admin Account
```
Email: admin@example.com
Password: password123
```
**Admin Features:**
- View all vaccination types
- Create new vaccination types
- Edit existing vaccination types
- Delete vaccination types

### Regular User Account
```
Email: user@example.com
Password: password123
```
**User Features:**
- View vaccination types (read-only)
- Cannot create, edit, or delete

## Key Features to Test

### 1. Authentication
- [ ] Register new account
- [ ] Login with email/password
- [ ] View user profile on home screen
- [ ] Sign out functionality

### 2. Vaccination Types (Admin Only)
- [ ] View list of vaccination types
- [ ] Search vaccination types by title
- [ ] Create new vaccination type
- [ ] Edit vaccination type (description only)
- [ ] Delete vaccination type
- [ ] Pull-to-refresh list

### 3. User Interface
- [ ] Navigate between Home and Vaccinations tabs
- [ ] View vaccination type details
- [ ] Responsive design on different screen sizes
- [ ] Error messages for invalid operations

## Database Overview

### Tables
- **users**: Stores user profiles and roles
- **vaccination_types**: Stores vaccination type information

### Security
- Row Level Security (RLS) enabled on all tables
- Admin-only operations for modifications
- Users can only read vaccination types

## Troubleshooting

### App Won't Start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Type Errors
```bash
npm run typecheck
```

### Port Already in Use
The dev server uses port 8081. If it's in use:
```bash
npm run dev -- --port 3000
```

## Architecture

### Frontend Structure
- **Screens**: Tab-based navigation (Home, Vaccinations)
- **Components**: Reusable UI components (Button, Input, Card)
- **State**: Zustand for auth, local state for forms
- **Navigation**: Expo Router for routing

### Backend (Supabase)
- **Auth**: Email/password authentication
- **Database**: PostgreSQL with RLS policies
- **Real-time**: Supabase Realtime for updates

### API
- **Service Layer**: `vaccination-service.ts` for API calls
- **Auth Store**: `auth-store.ts` for user state
- **Supabase Client**: `supabase.ts` for database connection

## File Structure

```
app/
├── (auth)/                 # Auth screens
│   ├── login.tsx
│   └── register.tsx
├── (app)/                  # Main app
│   ├── (tabs)/             # Tab screens
│   ├── create-vaccination.tsx
│   ├── edit-vaccination/[id].tsx
│   └── vaccination/[id].tsx
└── _layout.tsx             # Root layout

components/                # Reusable components
lib/                      # Services & stores
```

## Environment Variables

The app is already configured with Supabase credentials:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

No additional setup needed!

## Next Steps

1. **Start the app**: `npm run dev`
2. **Test with demo account**: Login as admin@example.com / password123
3. **Create vaccination type**: Click "Add New" button
4. **View details**: Tap on a vaccination type
5. **Explore features**: Try edit, delete, search

## Common Issues

### "Cannot find module 'zustand'"
```bash
npm install zustand
```

### Supabase connection error
Check `.env` file has correct credentials

### RLS policy errors
This means you're trying to perform an action your role doesn't allow. Use admin account or contact your administrator.

## Performance Tips

- App runs smoothly on web, iOS, and Android
- Real-time updates sync automatically
- Search is debounced for better performance
- Lists are virtualized for large datasets

## Need Help?

1. Check the README.md for detailed documentation
2. Review component prop types for usage
3. Check browser console for error details
4. Verify Supabase database and auth configuration

---

**Ready to go! Start with `npm run dev` and explore the app.**
