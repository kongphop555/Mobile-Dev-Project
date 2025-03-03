import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { usePockets } from '../context/PocketContext';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../utils/numberFormat';

export default function BillsSection() {
  const { pockets } = usePockets();
  const navigation = useNavigation();

  const upcomingBills = pockets
    .filter(pocket => 
      pocket.category === 'Bills' && 
      pocket.daysUntilDue && 
      !pocket.isPaid
    )
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  const navigateToBills = () => {
    navigation.navigate('Account', { initialTab: 'Bills' });
  };

  const BillCard = ({ bill }) => (
    <View style={styles.billCard}>
      <Text style={styles.billName}>{bill.name}</Text>
      <Text style={styles.dueText}>
        in {bill.daysUntilDue} days
      </Text>
      <TouchableOpacity
        style={styles.payButton}
        onPress={navigateToBills}
      >
        <Text style={styles.payButtonText}>pay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Bills</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {upcomingBills.map(bill => (
          <BillCard key={bill.id} bill={bill} />
        ))}
        {upcomingBills.length === 0 && (
          <Text style={styles.emptyText}>No upcoming bills</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  billCard: {
    backgroundColor: '#8A2BE2',
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    width: 160,
  },
  billName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dueText: {
    color: '#fff',
    opacity: 0.8,
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#8A2BE2',
    fontWeight: '600',
  },
  emptyText: {
    color: '#666',
  },
}); 