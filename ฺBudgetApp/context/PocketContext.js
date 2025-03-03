import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const PocketContext = createContext();
const STORAGE_KEY = '@pockets';

export function PocketProvider({ children }) {
  const [pockets, setPockets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load pockets from AsyncStorage on mount
  useEffect(() => {
    loadPockets();
  }, []);

  const loadPockets = async () => {
    try {
      const storedPockets = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPockets) {
        setPockets(JSON.parse(storedPockets));
      }
    } catch (error) {
      console.error('Error loading pockets:', error);
      Alert.alert('Error', 'Failed to load pockets');
    } finally {
      setLoading(false);
    }
  };

  // Save pockets to AsyncStorage whenever they change
  const savePockets = async (newPockets) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPockets));
    } catch (error) {
      console.error('Error saving pockets:', error);
      Alert.alert('Error', 'Failed to save pockets');
    }
  };

  const addPocket = async (newPocket) => {
    try {
      const pocketData = {
        id: Date.now().toString(),
        ...newPocket,
        createdAt: new Date().toISOString(),
        currentAmount: newPocket.category === 'expense' ? newPocket.goal : 0,
        transactions: [],
      };

      const updatedPockets = [...pockets, pocketData];
      setPockets(updatedPockets);
      await savePockets(updatedPockets);
      return true;
    } catch (error) {
      console.error('Error adding pocket:', error);
      Alert.alert('Error', 'Failed to create pocket');
      return false;
    }
  };

  const updatePocket = async (id, updates) => {
    try {
      const updatedPockets = pockets.map(pocket =>
        pocket.id === id ? { ...pocket, ...updates } : pocket
      );
      setPockets(updatedPockets);
      await savePockets(updatedPockets);
      return true;
    } catch (error) {
      console.error('Error updating pocket:', error);
      Alert.alert('Error', 'Failed to update pocket');
      return false;
    }
  };

  const deletePocket = async (id) => {
    try {
      const updatedPockets = pockets.filter(pocket => pocket.id !== id);
      setPockets(updatedPockets);
      await savePockets(updatedPockets);
      return true;
    } catch (error) {
      console.error('Error deleting pocket:', error);
      Alert.alert('Error', 'Failed to delete pocket');
      return false;
    }
  };

  const addTransaction = async (pocketId, transaction) => {
    try {
      const pocket = pockets.find(p => p.id === pocketId);
      if (!pocket) throw new Error('Pocket not found');

      const newAmount = transaction.type === 'income' 
        ? pocket.currentAmount + transaction.amount
        : pocket.currentAmount - transaction.amount;

      // Validate based on category
      if (pocket.category === 'saving') {
        if (newAmount < 0) {
          Alert.alert('Error', 'Insufficient funds in saving pocket');
          return false;
        }
      } else if (pocket.category === 'expense') {
        if (newAmount < 0) {
          Alert.alert('Error', 'Budget exceeded');
          return false;
        }
      }

      const updatedPocket = {
        ...pocket,
        currentAmount: newAmount,
        transactions: [
          ...pocket.transactions,
          { ...transaction, id: Date.now().toString(), date: new Date().toISOString() }
        ]
      };

      await updatePocket(pocketId, updatedPocket);
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Failed to add transaction');
      return false;
    }
  };

  const checkBillsDue = () => {
    const billPockets = pockets.filter(pocket => pocket.category === 'bills');
    const today = new Date();

    billPockets.forEach(bill => {
      if (bill.dueDate) {
        const dueDate = new Date(bill.dueDate);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays <= 3 && diffDays > 0) {
          Alert.alert(
            'Bill Due Soon',
            `${bill.name} (฿${bill.amount}) is due in ${diffDays} days. Would you like to pay now?`,
            [
              { text: 'Later', style: 'cancel' },
              { 
                text: 'Pay Now', 
                onPress: () => handleBillPayment(bill.id)
              }
            ]
          );
        }
      }
    });
  };

  const handleBillPayment = async (billId) => {
    // Implement bill payment logic here
    // This could integrate with a payment gateway or mark the bill as paid
  };

  const getPocketsByCategory = (category) => {
    return pockets.filter(pocket => pocket.category === category);
  };

  return (
    <PocketContext.Provider value={{
      pockets,
      loading,
      addPocket,
      updatePocket,
      deletePocket,
      getPocketsByCategory,
      addTransaction,
      checkBillsDue,
    }}>
      {children}
    </PocketContext.Provider>
  );
}

export function usePockets() {
  const context = useContext(PocketContext);
  if (context === undefined) {
    throw new Error('usePockets must be used within a PocketProvider');
  }
  return context;
}