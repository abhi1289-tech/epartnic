import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import sampleProducts from './sampleProducts.json';
import { Product } from '../types';

export const seedDatabase = async (): Promise<void> => {
  if (!import.meta.env.DEV) {
    console.log('Seeding is only available in development mode');
    return;
  }

  try {
    console.log('Starting database seeding...');
    
    // Check if products already exist
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (!productsSnapshot.empty) {
      console.log('Products already exist in database. Skipping seed.');
      return;
    }

    // Add sample products
    for (const productData of sampleProducts) {
      const productRef = doc(collection(db, 'products'));
      const product: Omit<Product, 'id'> = {
        ...productData,
        createdAt: new Date(),
        partnerId: 'system', // Default partner for seeded products
      };

      await setDoc(productRef, product);
      console.log(`Added product: ${product.name}`);
    }

    console.log(`Successfully seeded ${sampleProducts.length} products to the database`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Call this function to seed the database in development
if (import.meta.env.DEV) {
  console.log('Development mode detected. You can call seedDatabase() from the console to seed sample data.');
  
  // Make seedDatabase available globally for manual execution
  (window as any).seedDatabase = seedDatabase;
}