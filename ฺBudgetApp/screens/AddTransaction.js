import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePockets } from '../context/PocketContext';

export default function AddTransaction({ route, navigation }) {
  const { pocketId, category } = route.params;
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [loading, setLoading] = useState(false);
  const { addTransaction } = usePockets();

  const handleAddTransaction = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const success = await addTransaction(pocketId, {
        amount: numericAmount,
        description: description.trim(),
        type,
      });

      if (success) {
        Alert.alert(
          'Success',
          'Transaction added successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.activeTypeButton]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeButtonText, type === 'expense' && styles.activeTypeText]}>
              Expense
            </Text>
          </TouchableOpacity>
          {category !== 'bills' && (
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.activeTypeButton]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeButtonText, type === 'income' && styles.activeTypeText]}>
                Income
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>฿</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.addButton, !amount && styles.addButtonDisabled]}
          onPress={handleAddTransaction}
          disabled={!amount || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add Transaction</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTypeButton: {
    backgroundColor: '#8A2BE2',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  activeTypeText: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  currencySymbol: {
    fontSize: 20,
    color: '#8A2BE2',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonDisabled: {
    backgroundColor: '#D1D1D1',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 