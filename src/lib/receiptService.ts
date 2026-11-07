import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, deleteDoc, serverTimestamp as firestoreServerTimestamp } from 'firebase/firestore';
import { ReceiptData } from '../types';

export const saveReceiptToHistory = async (userId: string, receiptData: ReceiptData) => {
  try {
    const receiptsRef = collection(db, 'receipts');
    
    // We omit large image preview URLs to avoid document size limits
    const { imagePreviewUrl, ...safeReceiptData } = receiptData;

    const docRef = await addDoc(receiptsRef, {
      ...safeReceiptData,
      storeName: (safeReceiptData.storeName || 'Minimarket / Ritel').slice(0, 200),
      analyzedAt: safeReceiptData.analyzedAt || new Date().toISOString(),
      items: Array.isArray(safeReceiptData.items) ? safeReceiptData.items : [],
      userId,
      savedAt: firestoreServerTimestamp(),
      transactionTimestamp: receiptData.transactionDate ? new Date(receiptData.transactionDate).getTime() : Date.now(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'receipts');
    throw error;
  }
};

export const getUserReceipts = async (userId: string): Promise<ReceiptData[]> => {
  try {
    const receiptsRef = collection(db, 'receipts');
    // Simple query with client-side sort to avoid missing index issues
    const q = query(receiptsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const list = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
      } as unknown as ReceiptData;
    });

    // Urutkan dari yang terbaru berdasarkan waktu transaksi atau waktu analisis
    return list.sort((a, b) => {
      const timeA = a.transactionTimestamp || (a.analyzedAt ? new Date(a.analyzedAt).getTime() : 0);
      const timeB = b.transactionTimestamp || (b.analyzedAt ? new Date(b.analyzedAt).getTime() : 0);
      return timeB - timeA;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'receipts');
    return [];
  }
};

export const deleteReceipt = async (receiptId: string) => {
  try {
    await deleteDoc(doc(db, 'receipts', receiptId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `receipts/${receiptId}`);
    throw error;
  }
};

// Helper to provide a fallback since we use serverTimestamp
// Removed redundant function
