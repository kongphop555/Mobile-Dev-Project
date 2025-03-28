import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { usePockets } from '../context/PocketContext';
import { formatCurrency } from '../utils/numberFormat';

export default function BillDetailsScreen({ route, navigation }) {
  const { pocketId } = route.params;
  const { pockets, handlePayment } = usePockets();
  const bill = pockets.find(p => p.id === pocketId);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [eligiblePockets, setEligiblePockets] = useState([]);

  if (!bill) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Bill not found</Text>
      </SafeAreaView>
    );
  }

  const findEligiblePockets = () => {
    return pockets.filter(p => 
      p.category === 'expense' &&
      p.currentAmount >= bill.goal &&
      p.id !== bill.id
    );
  };

  const handlePayBill = () => {
    const available = findEligiblePockets();
    if (available.length === 0) {
      Alert.alert('Error', 'No eligible pockets with sufficient funds');
      return;
    }
    setEligiblePockets(available);
    setShowSourcePicker(true);
  };

  const renderSourcePicker = () => (
    <Modal visible={showSourcePicker} transparent>
      <View style={styles.modal}>
        <Text>Select payment source:</Text>
        {eligiblePockets.map(p => (
          <TouchableOpacity
            key={p.id}
            onPress={() => {
              handlePayment(bill.id, p.id);
              setShowSourcePicker(false);
            }}
          >
            <Text>{p.name} (฿{p.currentAmount})</Text>
          </TouchableOpacity>
        ))}
        <Button title="Cancel" onPress={() => setShowSourcePicker(false)} />
      </View>
    </Modal>
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.billCard}>
          <Text style={styles.billName}>{bill.name}</Text>
          <Text style={styles.billAmount}>{formatCurrency(bill.goal)}</Text>
          <Text style={styles.dueText}>Due in {bill.daysUntilDue} days</Text>
          
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayBill}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Payment Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Due Date</Text>
            <Text style={styles.infoValue}>
              in {bill.daysUntilDue} days
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Amount Due</Text>
            <Text style={styles.infoValue}>{formatCurrency(bill.goal)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, styles.statusText]}>
              {bill.isPaid ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
      {renderSourcePicker()}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8A2BE2',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  billCard: {
    backgroundColor: '#8A2BE2',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  billName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  billAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dueText: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 16,
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#666',
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusText: {
    color: '#8A2BE2',
  },
}); 