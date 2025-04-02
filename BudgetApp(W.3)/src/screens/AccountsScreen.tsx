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
} from 'lucide-react-native';
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
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <View style={[styles.balanceContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <DollarSign size={18} color={colors.surface} />
              <Text style={[styles.balanceText, { color: colors.surface }]}>Net Worth</Text>
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={[styles.summaryLabel, { color: colors.surface }]}>Total Assets</Text>
            <Text style={[styles.summaryAmount, { color: colors.surface }]}>
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <View style={[styles.balanceContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <TrendingUp size={18} color={colors.surface} />
              <Text style={[styles.balanceText, { color: colors.surface }]}>Growing Value</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
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