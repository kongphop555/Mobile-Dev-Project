import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MainTabNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  CreditCard,
  Wallet,
  Building,
  PiggyBank,
  DollarSign,
  TrendingUp,
  Utensils,
  ShoppingBag,
  Bus,
  Home,
  Tv,
  Briefcase,
  Plane,
  Gift,
  PartyPopper,
  AlertTriangle,
} from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import ScreenLayout from '../components/ScreenLayout';

const { width } = Dimensions.get('window');

type Props = {
  navigation: MainTabNavigationProp;
};

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  icon: any;
  color: string;
};

export default function AccountsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState('general');

  const accounts: Account[] = [
    {
      id: '1',
      name: 'Food & Drinks',
      type: 'general',
      balance: 100,
      currency: 'USD',
      icon: Utensils,
      color: '#ff4d4d',
    },
    {
      id: '2',
      name: 'Shopping',
      type: 'general',
      balance: 250,
      currency: 'USD',
      icon: ShoppingBag,
      color: '#f4c542',
    },
    {
      id: '3',
      name: 'Transportation',
      type: 'general',
      balance: 75,
      currency: 'USD',
      icon: Bus,
      color: '#4caf50',
    },
    {
      id: '4',
      name: 'Housing',
      type: 'general',
      balance: 900,
      currency: 'USD',
      icon: Home,
      color: '#2196f3',
    },
    {
      id: '5',
      name: 'Entertainment',
      type: 'general',
      balance: 180,
      currency: 'USD',
      icon: Tv,
      color: '#e91e63',
    },
    {
      id: '6',
      name: 'Investment',
      type: 'savings',
      balance: 5000,
      currency: 'USD',
      icon: Briefcase,
      color: '#4caf50',
    },
    {
      id: '7',
      name: 'Traveling',
      type: 'savings',
      balance: 1200,
      currency: 'USD',
      icon: Plane,
      color: '#2196f3',
    },
    {
      id: '8',
      name: 'Gifts',
      type: 'savings',
      balance: 300,
      currency: 'USD',
      icon: Gift,
      color: '#e91e63',
    },
    {
      id: '9',
      name: 'Party',
      type: 'savings',
      balance: 450,
      currency: 'USD',
      icon: PartyPopper,
      color: '#f4c542',
    },
    {
      id: '10',
      name: 'Emergency',
      type: 'savings',
      balance: 2000,
      currency: 'USD',
      icon: AlertTriangle,
      color: '#ff4d4d',
    },
  ];

  const generalTotal = accounts
    .filter(account => account.type === 'general')
    .reduce((sum, account) => sum + account.balance, 0);

  const savingsTotal = accounts
    .filter(account => account.type === 'savings')
    .reduce((sum, account) => sum + account.balance, 0);

  const totalLiabilities = accounts.reduce((sum, account) => sum + (account.balance < 0 ? -account.balance : 0), 0);

  return (
    <ScreenLayout backgroundColor={colors.background}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>
            My Finances
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddAccount')}
          >
            <Plus size={22} color={colors.surface} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.summaryContainer}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={[styles.summaryLabel, { color: colors.surface }]}>Total Balance</Text>
            <Text style={[styles.summaryAmount, { color: colors.surface }]}>
              ${generalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <View style={[styles.balanceContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <CreditCard size={18} color={colors.surface} />
              <Text style={[styles.balanceText, { color: colors.surface }]}>General</Text>
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={[styles.summaryLabel, { color: colors.surface }]}>Total Balance</Text>
            <Text style={[styles.summaryAmount, { color: colors.surface }]}>
              ${savingsTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <View style={[styles.balanceContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <PiggyBank size={18} color={colors.surface} />
              <Text style={[styles.balanceText, { color: colors.surface }]}>Savings</Text>
            </View>
          </View>

        </ScrollView>
      </LinearGradient>

      <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
        {['general', 'savings'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              { backgroundColor: activeFilter === filter ? colors.primary : 'transparent' },
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === filter ? colors.surface : colors.textSecondary },
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.accountsContainer}>
        {accounts
          .filter(account => activeFilter === account.type)
          .map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[styles.accountCard, { backgroundColor: colors.surface }]}
              onPress={() => {
                navigation.navigate('AccountDetails', { account });
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${account.color}15` }]}>
                <account.icon size={24} color={account.color} />
              </View>

              <View style={styles.accountContent}>
                <Text style={[styles.accountName, { color: colors.text, fontSize: 16 }]}>
                  {account.name}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  {account.currency} {account.balance.toFixed(2)}
                </Text>
              </View>

              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  summaryContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 24,
    marginRight: 16,
    width: width * 0.75,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  summaryLabel: {
    fontSize: 15,
    marginBottom: 12,
    opacity: 0.9,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  balanceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 24,
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  accountsContainer: {
    padding: 20,
    paddingTop: 8,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'space-between', // Added
  },
  accountContent: {
    flex: 1,
    marginLeft: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  accountType: {
    fontSize: 14,
    opacity: 0.7,
  },
  accountDetails: {
    alignItems: 'flex-end',
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  changeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
  },
}); 