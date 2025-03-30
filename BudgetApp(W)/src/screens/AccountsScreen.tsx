import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
} from 'lucide-react-native';

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
  change: number;
};

export default function AccountsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  const accounts: Account[] = [
    {
      id: '1',
      name: 'Main Checking',
      type: 'Bank Account',
      balance: 5280.50,
      currency: 'USD',
      icon: Building,
      color: colors.primary,
      change: 12.5,
    },
    {
      id: '2',
      name: 'Savings',
      type: 'Savings Account',
      balance: 12450.75,
      currency: 'USD',
      icon: PiggyBank,
      color: colors.success,
      change: 8.3,
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'Credit',
      balance: -1250.00,
      currency: 'USD',
      icon: CreditCard,
      color: colors.danger,
      change: -2.1,
    },
    {
      id: '4',
      name: 'Investment',
      type: 'Investment Account',
      balance: 28750.00,
      currency: 'USD',
      icon: TrendingUp,
      color: colors.accent,
      change: 15.7,
    },
    {
      id: '5',
      name: 'Cash Wallet',
      type: 'Cash',
      balance: 350.00,
      currency: 'USD',
      icon: Wallet,
      color: colors.gold,
      change: 0,
    },
  ];

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAssets = accounts.reduce((sum, account) => sum + (account.balance > 0 ? account.balance : 0), 0);
  const totalLiabilities = accounts.reduce((sum, account) => sum + (account.balance < 0 ? -account.balance : 0), 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.surface }]}>
            Accounts
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
            onPress={() => navigation.navigate('AddAccount')}
          >
            <Plus size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.summaryContainer}
        >
          <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={[styles.summaryLabel, { color: colors.surface }]}>Net Worth</Text>
            <Text style={[styles.summaryAmount, { color: colors.surface }]}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <View style={[styles.balanceContainer, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <DollarSign size={16} color={colors.surface} />
              <Text style={[styles.balanceText, { color: colors.surface }]}>Total Balance</Text>
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={[styles.summaryLabel, { color: colors.surface }]}>Assets</Text>
            <Text style={[styles.summaryAmount, { color: colors.surface }]}>
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <View style={[styles.balanceContainer, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <TrendingUp size={16} color={colors.surface} />
              <Text style={[styles.balanceText, { color: colors.surface }]}>Total Assets</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
        {['all', 'bank', 'credit', 'investment', 'cash'].map((filter) => (
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

      {/* Accounts List */}
      <View style={styles.accountsContainer}>
        {accounts
          .filter(account => 
            activeFilter === 'all' || 
            account.type.toLowerCase().includes(activeFilter)
          )
          .map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[styles.accountCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${account.color}15` }]}>
                <account.icon size={24} color={account.color} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={[styles.accountName, { color: colors.text }]}>
                  {account.name}
                </Text>
                <Text style={[styles.accountType, { color: colors.textSecondary }]}>
                  {account.type}
                </Text>
              </View>
              <View style={styles.accountDetails}>
                <Text
                  style={[
                    styles.accountBalance,
                    { color: account.balance >= 0 ? colors.success : colors.danger },
                  ]}
                >
                  ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
                {account.change !== 0 && (
                  <View style={[
                    styles.changeContainer,
                    { backgroundColor: account.change > 0 ? `${colors.success}15` : `${colors.danger}15` }
                  ]}>
                    <Text style={[
                      styles.changeText,
                      { color: account.change > 0 ? colors.success : colors.danger }
                    ]}>
                      {account.change > 0 ? '+' : ''}{account.change}%
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    width: width * 0.6,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    margin: 20,
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  accountsContainer: {
    padding: 20,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
  },
  accountDetails: {
    alignItems: 'flex-end',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 