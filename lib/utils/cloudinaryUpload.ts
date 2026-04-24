// Alternative image upload using Cloudinary
// Install: npm install cloudinary

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'products'); // Create this preset in Cloudinary

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/your-cloud-name/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
