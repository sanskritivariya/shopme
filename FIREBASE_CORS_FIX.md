# Firebase Storage CORS Fix

## Problem
Images are failing to upload to Firebase Storage due to CORS policy errors. The product is created successfully but images don't get uploaded.

## Solution Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Deploy CORS Configuration
Run this command from your project root:
```bash
gsutil cors set cors.json gs://your-storage-bucket-name
```

Replace `your-storage-bucket-name` with your actual Firebase Storage bucket name (e.g., `shop-me-7c9e7.firebasestorage.app`).

### 4. Alternative: Use Firebase Console
1. Go to Firebase Console → Storage
2. Click on the "Files" tab
3. Click the three dots menu → "Configure access"
4. Add CORS rules via the Cloud Storage console

### 5. Verify CORS Configuration
Check the current CORS settings:
```bash
gsutil cors get gs://your-storage-bucket-name
```

## Current CORS Configuration
The `cors.json` file in your project root contains:
```json
[
  {
    "origin": ["http://localhost:3000", "https://yourdomain.com"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]
```

**Important**: Replace `"https://yourdomain.com"` with your actual deployed domain.

## Temporary Workaround
The code now handles image upload failures gracefully:
- Products are created even if image upload fails
- Users receive a warning message about the upload failure
- You can add images later by updating the product

## Testing
After fixing CORS, test image uploads by:
1. Creating a new product with an image
2. Checking the browser console for successful upload messages
3. Verifying images appear in Firebase Storage console
