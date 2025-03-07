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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePockets } from '../context/PocketContext';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePocketScreen({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('saving');
  const [dueDate, setDueDate] = useState('');
  const { addPocket } = usePockets();

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a pocket name');
      return;
    }

    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (category === 'bills' && !dueDate.trim()) {
      Alert.alert('Error', 'Please enter a due date');
      return;
    }

    try {
      await addPocket({
        name: name.trim(),
        goal: numericAmount,
        category,
        dueDate: category === 'bills' ? dueDate.trim() : null,
        currentAmount: category === 'expense' ? numericAmount : 0,
        transactions: [],
      });
      
      Alert.alert(
        'Success',
        'Pocket created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create pocket');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Pocket</Text>
        <View style={styles.rightPlaceholder} />
      </View>
      <ScrollView style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.categorySelector}>
            <TouchableOpacity
              style={[styles.categoryButton, category === 'saving' && styles.activeCategoryButton]}
              onPress={() => setCategory('saving')}
            >
              <Text style={[styles.categoryButtonText, category === 'saving' && styles.activeCategoryText]}>
                Saving
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, category === 'expense' && styles.activeCategoryButton]}
              onPress={() => setCategory('expense')}
            >
              <Text style={[styles.categoryButtonText, category === 'expense' && styles.activeCategoryText]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, category === 'bills' && styles.activeCategoryButton]}
              onPress={() => setCategory('bills')}
            >
              <Text style={[styles.categoryButtonText, category === 'bills' && styles.activeCategoryText]}>
                Bills
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter pocket name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {category === 'saving' ? 'Target Amount' : category === 'expense' ? 'Budget Amount' : 'Bill Amount'}
            </Text>
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

          {category === 'bills' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Days until due</Text>
              <TextInput
                style={styles.input}
                value={dueDate}
                onChangeText={setDueDate}
                keyboardType="numeric"
                placeholder="Enter number of days (e.g., 30)"
                placeholderTextColor="#999"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.createButton, (!name || !amount || (category === 'bills' && !dueDate)) && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={!name || !amount || (category === 'bills' && !dueDate)}
          >
            <Text style={styles.createButtonText}>Create Pocket</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  rightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#8A2BE2',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeCategoryText: {
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
  createButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonDisabled: {
    backgroundColor: '#D1D1D1',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 