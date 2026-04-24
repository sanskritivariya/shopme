import { storage, ref, uploadBytes, getDownloadURL } from '@/lib/firebase'

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const uploadMultipleImages = async (files: File[], basePath: string): Promise<string[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const timestamp = Date.now()
    const fileName = `${timestamp}_${index}_${file.name}`
    const path = `${basePath}/${fileName}`
    return uploadImage(file, path)
  })

  try {
    const urls = await Promise.all(uploadPromises)
    return urls
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    throw error
  }
}

export const generateImagePath = (userId: string, productId: string): string => {
  return `products/${userId}/${productId}`
}
