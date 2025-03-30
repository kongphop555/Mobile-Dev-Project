import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabNavigationProp } from '../types/navigation';
import { useTheme, globalStyles } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Gamepad2,
  Plane,
  Utensils,
  ShoppingCart,
  Heart,
  Wifi,
  Smartphone,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'shopping', icon: 'cart-outline', label: 'Shopping' },
  { id: 'food', icon: 'restaurant-outline', label: 'Food & Drinks' },
  { id: 'transport', icon: 'car-outline', label: 'Transport' },
  { id: 'utilities', icon: 'flash-outline', label: 'Utilities' },
  { id: 'entertainment', icon: 'game-controller-outline', label: 'Entertainment' },
  { id: 'health', icon: 'medical-outline', label: 'Health' },
];

export default function AddTransactionScreen() {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSave = () => {
    // Add transaction logic here
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF8F3F', '#E67E38']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Transaction</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.amountContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={24}
                  color={selectedCategory === category.id ? '#FF8F3F' : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === category.id && styles.selectedCategoryLabel,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSave}
        >
          <LinearGradient
            colors={['#FF8F3F', '#E67E38']}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  amountContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#FF8F3F',
    paddingVertical: 8,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: (width - 52) / 3,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCategory: {
    backgroundColor: 'rgba(255, 143, 63, 0.15)',
    borderColor: '#FF8F3F',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  selectedCategoryLabel: {
    color: '#FF8F3F',
  },
  noteContainer: {
    marginBottom: 24,
  },
  noteInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 