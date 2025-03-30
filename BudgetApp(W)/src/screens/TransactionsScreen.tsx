import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme, globalStyles } from '../context/ThemeContext';
import { MainTabNavigationProp, AppStackNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Search,
  Filter,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Gamepad2,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createAnimationHooks, sharedStyles } from '../utils/animations';

const { width } = Dimensions.get('window');

type IconName = keyof typeof Ionicons.glyphMap;

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  icon: IconName;
};

export default function TransactionsScreen() {
  const navigation = useNavigation<AppStackNavigationProp>();
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const {
    glowAnim,
    pulseAnim,
    backgroundAnim,
    contentAnim,
    glowOpacity,
    fadeInScale,
    startAnimations,
  } = createAnimationHooks();

  useEffect(() => {
    startAnimations();
  }, []);

  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Shopping Mall',
      amount: 450.80,
      type: 'expense',
      category: 'Shopping',
      date: 'Today, 14:30',
      icon: 'cart-outline',
    },
    {
      id: '2',
      title: 'Salary Deposit',
      amount: 5200.00,
      type: 'income',
      category: 'Salary',
      date: 'Today, 09:15',
      icon: 'cash-outline',
    },
    {
      id: '3',
      title: 'Starbucks Coffee',
      amount: 8.50,
      type: 'expense',
      category: 'Food & Drinks',
      date: 'Yesterday, 16:45',
      icon: 'cafe-outline',
    },
    {
      id: '4',
      title: 'Uber Ride',
      amount: 24.99,
      type: 'expense',
      category: 'Transportation',
      date: 'Yesterday, 13:20',
      icon: 'car-outline',
    },
    {
      id: '5',
      title: 'Rent Payment',
      amount: 1800.00,
      type: 'expense',
      category: 'Housing',
      date: '24 Mar, 10:00',
      icon: 'home-outline',
    },
    {
      id: '6',
      title: 'Game Purchase',
      amount: 59.99,
      type: 'expense',
      category: 'Entertainment',
      date: '23 Mar, 15:30',
      icon: 'game-controller-outline',
    },
  ];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const renderTransaction = (transaction: Transaction) => (
    <TouchableOpacity 
      key={transaction.id}
      style={[styles.transactionCard, sharedStyles.card]}
      onPress={() => navigation.navigate('TransactionDetails', { id: transaction.id })}
    >
      <View style={styles.transaction}>
        <View style={[
          styles.transactionIcon,
          { backgroundColor: transaction.type === 'income' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 59, 48, 0.2)' }
        ]}>
          <Ionicons 
            name={transaction.icon} 
            size={24} 
            color={transaction.type === 'income' ? '#4CAF50' : '#FF3B30'} 
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{transaction.title}</Text>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          { color: transaction.type === 'income' ? '#4CAF50' : '#FF3B30' }
        ]}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={sharedStyles.container}>
      <Animated.View style={{ opacity: backgroundAnim }}>
        <LinearGradient
          colors={['#FFB23F', '#FF8F3F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <Animated.View 
            style={[
              styles.gradientGlow,
              { 
                opacity: glowOpacity,
                transform: [
                  { scale: pulseAnim },
                  { 
                    translateY: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
              }
            ]} 
          />
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, fadeInScale]}>
          <Text style={sharedStyles.heading}>Transactions</Text>
          <Text style={sharedStyles.subheading}>Your financial activity</Text>
        </Animated.View>

        <Animated.View style={[styles.summaryCards, fadeInScale]}>
          <View style={[styles.summaryCard, sharedStyles.card]}>
            <LinearGradient
              colors={['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)']}
              style={styles.summaryGradient}
            >
              <Ionicons name="arrow-up-outline" size={24} color="#4CAF50" />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryAmount, { color: '#4CAF50' }]}>
                +${totalIncome.toFixed(2)}
              </Text>
            </LinearGradient>
          </View>

          <View style={[styles.summaryCard, sharedStyles.card]}>
            <LinearGradient
              colors={['rgba(255, 59, 48, 0.2)', 'rgba(255, 59, 48, 0.1)']}
              style={styles.summaryGradient}
            >
              <Ionicons name="arrow-down-outline" size={24} color="#FF3B30" />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryAmount, { color: '#FF3B30' }]}>
                -${totalExpenses.toFixed(2)}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View style={[styles.filterContainer, fadeInScale]}>
          {['all', 'income', 'expense'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View style={fadeInScale}>
          {transactions
            .filter(t => activeFilter === 'all' || t.type === activeFilter)
            .map(renderTransaction)}
        </Animated.View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, sharedStyles.button]}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <LinearGradient
          colors={['#FFD93F', '#FF8F3F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addButtonGradient}
        >
          <Ionicons name="add" size={24} color="#000000" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  gradientGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    height: 240,
    backgroundColor: '#FFB23F',
    opacity: 0.25,
    transform: [{ scale: 1.3 }],
    borderRadius: 30,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    width: (width - 48) / 2,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(255, 178, 63, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#FFB23F',
  },
  filterText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000000',
  },
  transactionCard: {
    marginBottom: 16,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
}); 