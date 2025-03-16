import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePockets } from '../context/PocketContext';

export default function HomeScreen({ navigation }) {
  const { pockets, getPocketsByCategory } = usePockets();

  // Calculate total balance from all pockets
  const totalBalance = pockets.reduce((sum, pocket) => sum + pocket.currentAmount, 0);
  
  // Get upcoming bills
  const bills = getPocketsByCategory('bills').sort((a, b) => a.dueDate - b.dueDate);

  const navigateToAccount = (category = 'saving') => {
    navigation.navigate('Account', { initialCategory: category });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.headerText}>Home</Text>

        {/* Current Balance Card - Clickable */}
        <TouchableOpacity 
          style={styles.balanceCard}
          onPress={() => navigateToAccount()}
        >
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>฿{totalBalance.toLocaleString()}</Text>
        </TouchableOpacity>

        {/* Upcoming Bills Section */}
        <View style={styles.billsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bills</Text>
            <TouchableOpacity onPress={() => navigateToAccount('bills')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.billsScrollView}
          >
            {bills.map((bill) => (
              <TouchableOpacity
                key={bill.id}
                style={styles.billCard}
                onPress={() => navigation.navigate('PocketDetails', { pocket: bill })}
              >
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billDueDate}>in {bill.dueDate} days</Text>
                <Text style={styles.billAmount}>฿{bill.goal.toLocaleString()}</Text>
                <TouchableOpacity 
                  style={styles.payButton}
                  onPress={() => navigation.navigate('PocketDetails', { pocket: bill })}
                >
                  <Text style={styles.payButtonText}>pay</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  billsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllText: {
    color: '#8A2BE2',
    fontSize: 14,
    fontWeight: '600',
  },
  billsScrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  billCard: {
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    padding: 16,
    marginRight: 12,
    width: 150,
  },
  billName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  billDueDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  billAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#8A2BE2',
    fontSize: 14,
    fontWeight: '600',
  },
}); 