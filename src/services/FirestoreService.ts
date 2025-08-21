import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Address, Order, FilterOptions, PaginationInfo } from '../types';

export class FirestoreService {
  // Products
  static async getProducts(
    filters: FilterOptions = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<{ products: Product[]; pagination: PaginationInfo }> {
    try {
      let baseQuery = collection(db, 'products');
      let constraints: any[] = [];

      // Apply filters
      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters.brand) {
        constraints.push(where('brand', '==', filters.brand));
      }
      if (filters.vehicle?.make) {
        constraints.push(where('vehicle.make', '==', filters.vehicle.make));
      }
      if (filters.vehicle?.model) {
        constraints.push(where('vehicle.model', '==', filters.vehicle.model));
      }
      if (filters.vehicle?.year) {
        constraints.push(where('vehicle.year', '==', filters.vehicle.year));
      }

      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(pagination.limit));

      const q = query(baseQuery, ...constraints);
      const snapshot = await getDocs(q);
      
      const products: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Product[];

      // For simplicity, we're not implementing true pagination here
      // In a real app, you'd need to handle startAfter for pagination
      const paginationInfo: PaginationInfo = {
        page: pagination.page,
        limit: pagination.limit,
        total: products.length,
        hasNext: products.length === pagination.limit,
        hasPrev: pagination.page > 1,
      };

      return { products, pagination: paginationInfo };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Product[];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Addresses
  static async getAddresses(userId: string): Promise<Address[]> {
    try {
      const q = query(
        collection(db, 'addresses', userId, 'userAddresses'),
        orderBy('isDefault', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Address[];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  static async saveAddress(userId: string, address: Omit<Address, 'id'>): Promise<string> {
    try {
      const addressRef = doc(collection(db, 'addresses', userId, 'userAddresses'));
      await setDoc(addressRef, address);
      return addressRef.id;
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  }

  static async updateAddress(userId: string, addressId: string, address: Partial<Address>): Promise<void> {
    try {
      const addressRef = doc(db, 'addresses', userId, 'userAddresses', addressId);
      await updateDoc(addressRef, address);
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  static async deleteAddress(userId: string, addressId: string): Promise<void> {
    try {
      const addressRef = doc(db, 'addresses', userId, 'userAddresses', addressId);
      await deleteDoc(addressRef);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  // Orders
  static async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    try {
      const orderRef = doc(collection(db, 'orders'));
      const orderData = {
        ...order,
        createdAt: Timestamp.now(),
      };
      await setDoc(orderRef, orderData);
      return orderRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Admin functions
  static async listAllOrders(limit: number = 50): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  // Partner functions
  static async getPartnerInventory(partnerId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('partnerId', '==', partnerId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Product[];
    } catch (error) {
      console.error('Error fetching partner inventory:', error);
      throw error;
    }
  }

  static async addPartnerProduct(partnerId: string, product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    try {
      const productRef = doc(collection(db, 'products'));
      const productData = {
        ...product,
        partnerId,
        createdAt: Timestamp.now(),
      };
      await setDoc(productRef, productData);
      return productRef.id;
    } catch (error) {
      console.error('Error adding partner product:', error);
      throw error;
    }
  }
}