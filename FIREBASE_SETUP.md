# Firebase Setup Guide for ShopMe

This guide will help you set up Firebase authentication and database for your ShopMe application with admin and user portals.

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name (e.g., "shopme-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 🔧 Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Get started"
2. Enable "Email/Password" sign-in method
3. Click "Save"

## 📊 Step 3: Set up Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location (choose closest to your users)
4. Click "Enable"

## 🔑 Step 4: Get Firebase Configuration

1. Go to Project Settings → General → Your apps
2. Click "Web app" (</>) icon
3. Copy the Firebase configuration object
4. Update your `.env.local` file with these values

## ⚙️ Step 5: Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

## 👤 Step 6: Create Admin User

### Method 1: Using the Setup Script
1. Update the admin credentials in `scripts/setupFirebase.js`
2. Run the script:
   ```bash
   node scripts/setupFirebase.js
   ```

### Method 2: Manual Creation
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Enter admin email and password
4. Go to Firestore Database
5. Create a document in `users` collection with the user's UID:
   ```javascript
   {
     uid: "user-uid-from-auth",
     email: "admin@shopme.com",
     role: "admin",
     createdAt: "2024-01-01T00:00:00.000Z",
     name: "Admin User",
     permissions: ["read", "write", "delete", "manage_users"]
   }
   ```

## 📁 Step 7: Update App Layout

Wrap your app with the AuthProvider in your root layout:

```tsx
// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

## 🏗️ Database Structure

### Users Collection
```
users/{userUid}
├── uid: string (Firebase Auth UID)
├── email: string
├── role: 'admin' | 'user'
├── createdAt: string (ISO timestamp)
├── name: string (optional)
└── permissions: array (admin only)
```

### Example Documents

**Admin User:**
```javascript
{
  uid: "abc123...",
  email: "admin@shopme.com",
  role: "admin",
  createdAt: "2024-01-01T00:00:00.000Z",
  name: "Admin User",
  permissions: ["read", "write", "delete", "manage_users"]
}
```

**Regular User:**
```javascript
{
  uid: "def456...",
  email: "user@example.com",
  role: "user",
  createdAt: "2024-01-01T00:00:00.000Z",
  name: "John Doe"
}
```

## 🚦 Step 8: Test Authentication

### Admin Login
- Email: `admin@shopme.com`
- Password: `admin123456` (or whatever you set)
- Redirects to: `/admin`

### User Registration
- Any email/password combination
- Redirects to: `/dashboard`

### User Login
- Use registered user credentials
- Redirects to: `/dashboard`

## 🔒 Security Rules

Add these security rules to your Firestore Database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Admins can read all user profiles
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admin-only collections (add as needed)
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🎯 Next Steps

1. Create admin dashboard at `/admin`
2. Create user dashboard at `/dashboard`
3. Add role-based route protection
4. Implement user management features
5. Add more authentication providers (Google, Facebook, etc.)

## 🐛 Troubleshooting

**Common Issues:**
- Make sure all environment variables start with `NEXT_PUBLIC_`
- Check that Firebase Authentication is enabled
- Verify Firestore database rules
- Ensure email/password sign-in method is enabled

**Error Messages:**
- `Firebase: Error (auth/api-key-not-valid)` → Check your API key
- `Firebase: Error (auth/user-not-found)` → User doesn't exist
- `Firebase: Error (auth/wrong-password)` → Incorrect password

## 📞 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Verify environment variables
3. Check browser console for detailed error messages
4. Ensure Firebase SDK is properly installed
