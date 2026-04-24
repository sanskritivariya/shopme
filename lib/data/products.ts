import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Product {
  id?: string
  name: string
  description: string
  category: string
  price: number
  imageUrl?: string
  images?: string[] // Multiple images
  stock: number
  status: 'active' | 'inactive'
  createdBy: string
  createdAt: string
  updatedAt: string
  tags?: string[] // Additional tags for better filtering
  specifications?: Record<string, any> // Additional product specs
  sizes?: string[] // Available sizes (e.g., S, M, L, XL or US 8, US 9, etc.)
}

export interface Category {
  id?: string
  name: string
  description: string
  parentCategory?: string // For hierarchical categories (e.g., Shoes -> Men Shoes)
  image?: string
  createdAt: string
  updatedAt: string
}

// Product CRUD operations
export const createProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  try {
    console.log('Creating product with data:', product)
    console.log('Firebase db initialized:', !!db)

    const now = new Date().toISOString()
    const productData = {
      ...product,
      createdAt: now,
      updatedAt: now,
    }

    console.log('Final product data to save:', productData)
    console.log('Attempting to add to products collection...')

    const docRef = await addDoc(collection(db, 'products'), productData)
    console.log('Product created successfully with ID:', docRef.id)

    return { success: true, id: docRef.id }
  } catch (error: any) {
    console.error('Error creating product:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Full error:', error)
    return { success: false, error: error.message }
  }
}

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const productData = {
      ...product,
      updatedAt: new Date().toISOString(),
    }

    await updateDoc(doc(db, 'products', id), productData)
    return { success: true }
  } catch (error: any) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message }
  }
}

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id))
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message }
  }
}

export const getProduct = async (id: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'products', id))
    if (docSnap.exists()) {
      return {
        success: true,
        product: { id: docSnap.id, ...docSnap.data() } as Product,
      }
    } else {
      return { success: false, error: 'Product not found' }
    }
  } catch (error: any) {
    console.error('Error getting product:', error)
    return { success: false, error: error.message }
  }
}

export const getAllProducts = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Product,
    )
    return { success: true, products }
  } catch (error: any) {
    console.error('Error getting products:', error)
    return { success: false, error: error.message }
  }
}

export const getProductsByCategory = async (category: string) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
    )
    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Product,
    )
    return { success: true, products }
  } catch (error: any) {
    console.error('Error getting products by category:', error)
    return { success: false, error: error.message }
  }
}

export const getActiveProducts = async () => {
  try {
    const q = query(
      collection(db, 'products'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
    )
    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Product,
    )
    return { success: true, products }
  } catch (error: any) {
    console.error('Error getting active products:', error)
    return { success: false, error: error.message }
  }
}

// Category CRUD operations
export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  try {
    const now = new Date().toISOString()
    const categoryData = {
      ...category,
      createdAt: now,
      updatedAt: now,
    }
    const docRef = await addDoc(collection(db, 'categories'), categoryData)
    return { success: true, id: docRef.id }
  } catch (error: any) {
    console.error('Error creating category:', error)
    return { success: false, error: error.message }
  }
}

export const updateCategory = async (
  id: string,
  category: Partial<Category>,
) => {
  try {
    const categoryData = {
      ...category,
      updatedAt: new Date().toISOString(),
    }
    await updateDoc(doc(db, 'categories', id), categoryData)
    return { success: true }
  } catch (error: any) {
    console.error('Error updating category:', error)
    return { success: false, error: error.message }
  }
}

export const deleteCategory = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'categories', id))
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message }
  }
}

export const getAllCategories = async () => {
  try {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const categories = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Category,
    )
    return { success: true, categories }
  } catch (error: any) {
    console.error('Error getting categories:', error)
    return { success: false, error: error.message }
  }
}

export const getCategoriesByParent = async (parentCategory?: string) => {
  try {
    let q = query(collection(db, 'categories'), orderBy('name'))
    if (parentCategory) {
      q = query(q, where('parentCategory', '==', parentCategory))
    } else {
      q = query(q, where('parentCategory', '==', null))
    }
    const querySnapshot = await getDocs(q)
    const categories = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Category,
    )
    return { success: true, categories }
  } catch (error: any) {
    console.error('Error getting categories by parent:', error)
    return { success: false, error: error.message }
  }
}
