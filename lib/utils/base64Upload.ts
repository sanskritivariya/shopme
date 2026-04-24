// Simple base64 image upload - stores images directly in Firestore
// Good for small images and development

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImageAsBase64 = async (file: File): Promise<string> => {
  try {
    // Check file size (limit to 1MB for Firestore)
    if (file.size > 1024 * 1024) {
      throw new Error('Image too large. Please use an image smaller than 1MB.');
    }
    
    const base64 = await fileToBase64(file);
    return base64;
  } catch (error) {
    console.error('Base64 conversion error:', error);
    throw error;
  }
};
