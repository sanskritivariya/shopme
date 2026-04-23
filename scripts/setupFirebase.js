// Firebase Setup Script
// Run this script to create the initial admin user in Firebase

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Import Firebase SDK (you need to install firebase first)
// npm install firebase

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin user credentials (change these to your desired admin credentials)
const ADMIN_EMAIL = 'admin@shopme.com';
const ADMIN_PASSWORD = 'admin123456'; // Change this to a strong password
const ADMIN_NAME = 'Admin User';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create admin user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      ADMIN_EMAIL, 
      ADMIN_PASSWORD
    );
    
    // Create admin user profile in Firestore
    const adminProfile = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: 'admin',
      createdAt: new Date().toISOString(),
      name: ADMIN_NAME,
      permissions: ['read', 'write', 'delete', 'manage_users']
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), adminProfile);
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('Please change the password after first login.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists. You can use the existing credentials.');
    }
  }
}

// Database structure documentation
console.log(`
📋 Firebase Database Structure for ShopMe:

🗂️ Collection: users
├── Document: {userUid}
│   ├── uid: string (Firebase Auth UID)
│   ├── email: string
│   ├── role: 'admin' | 'user'
│   ├── createdAt: string (ISO timestamp)
│   ├── name: string (optional)
│   └── permissions: array (for admin users)

🔐 Authentication Rules:
- Admin users have role: 'admin'
- Regular users have role: 'user'
- All users are created through signup form except admin
- Admin users are created through this script

🚀 Usage:
1. Replace firebaseConfig with your actual Firebase project config
2. Install firebase: npm install firebase
3. Run: node scripts/setupFirebase.js
4. Update your .env.local file with Firebase config
`);

// Uncomment the line below to actually create the admin user
// createAdminUser();

export { createAdminUser };
