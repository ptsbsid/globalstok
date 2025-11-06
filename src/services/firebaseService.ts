import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Warehouse } from '../types/warehouse';

const COLLECTION_NAME = 'warehouses';

// Helper to convert Firestore Timestamp to Date
const convertTimestampToDate = (data: any): any => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(convertTimestampToDate);
  }
  
  if (typeof data === 'object' && data !== null) {
    if (data instanceof Timestamp) {
      return data.toDate();
    }
    
    const converted: any = {};
    for (const key in data) {
      if (key === 'lastUpdated' && data[key]?.toDate) {
        converted[key] = data[key].toDate();
      } else if (key === 'tanks' && Array.isArray(data[key])) {
        converted[key] = data[key].map((tank: any) => ({
          ...tank,
          lastUpdated: tank.lastUpdated?.toDate ? tank.lastUpdated.toDate() : new Date(tank.lastUpdated)
        }));
      } else {
        converted[key] = convertTimestampToDate(data[key]);
      }
    }
    return converted;
  }
  
  return data;
};

// Save warehouses to Firestore
export const saveWarehousesToFirestore = async (warehouses: Warehouse[]): Promise<void> => {
  try {
    const warehousesRef = collection(db, COLLECTION_NAME);
    
    for (const warehouse of warehouses) {
      const warehouseDoc = doc(warehousesRef, warehouse.id);
      
      // Convert Date objects to Firestore Timestamps
      const warehouseData = {
        ...warehouse,
        lastUpdated: Timestamp.fromDate(warehouse.lastUpdated),
        tanks: warehouse.tanks.map(tank => ({
          ...tank,
          lastUpdated: Timestamp.fromDate(tank.lastUpdated)
        }))
      };
      
      await setDoc(warehouseDoc, warehouseData, { merge: true });
    }
  } catch (error) {
    console.error('Error saving warehouses to Firestore:', error);
    throw error;
  }
};

// Load warehouses from Firestore
export const loadWarehousesFromFirestore = async (): Promise<Warehouse[] | null> => {
  try {
    const warehousesRef = collection(db, COLLECTION_NAME);
    const warehouses: Warehouse[] = [];
    
    // Get all warehouse documents
    const snapshot = await getDoc(doc(warehousesRef, 'wh-ploso'));
    if (snapshot.exists()) {
      // If we have at least one document, load all
      const warehouseIds = ['wh-ploso', 'wh-kemiri', 'wh-safenlock'];
      
      for (const id of warehouseIds) {
        const docRef = doc(warehousesRef, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = convertTimestampToDate(docSnap.data());
          warehouses.push(data as Warehouse);
        }
      }
      
      return warehouses.length > 0 ? warehouses : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading warehouses from Firestore:', error);
    return null;
  }
};

// Subscribe to real-time updates
export const subscribeToWarehouses = (
  callback: (warehouses: Warehouse[]) => void
): (() => void) => {
  const warehousesRef = collection(db, COLLECTION_NAME);
  const warehouses: Warehouse[] = [];
  const warehouseIds = ['wh-ploso', 'wh-kemiri', 'wh-safenlock'];
  
  const unsubscribers: (() => void)[] = [];
  
  warehouseIds.forEach(id => {
    const docRef = doc(warehousesRef, id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = convertTimestampToDate(docSnap.data());
        const index = warehouses.findIndex(w => w.id === id);
        
        if (index >= 0) {
          warehouses[index] = data as Warehouse;
        } else {
          warehouses.push(data as Warehouse);
        }
        
        // Sort to maintain order
        warehouses.sort((a, b) => {
          const order = ['wh-ploso', 'wh-kemiri', 'wh-safenlock'];
          return order.indexOf(a.id) - order.indexOf(b.id);
        });
        
        callback([...warehouses]);
      }
    }, (error) => {
      console.error('Error in real-time subscription:', error);
    });
    
    unsubscribers.push(unsubscribe);
  });
  
  // Return unsubscribe function
  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
};

// Initialize Firestore with default data if empty
export const initializeFirestore = async (defaultWarehouses: Warehouse[]): Promise<void> => {
  try {
    const warehouses = await loadWarehousesFromFirestore();
    
    if (!warehouses || warehouses.length === 0) {
      // Firestore is empty, initialize with default data
      await saveWarehousesToFirestore(defaultWarehouses);
      console.log('Firestore initialized with default data');
    }
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};

