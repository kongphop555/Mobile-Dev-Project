import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePockets } from '../context/PocketContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PocketDetails({ route }) {
  const navigation = useNavigation();
  const { pocket } = route.params;
  const { updatePocket, deletePocket } = usePockets();
  
  const progress = pocket.goal ? (pocket.currentAmount / pocket.goal) * 100 : 0;

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${Math.min(progress, 100)}%` },
            pocket.category === 'expense' && styles.progressBarExpense
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
    </View>
  );

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionTitle}>{item.description || 'Transaction'}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        item.type === 'income' ? styles.incomeText : styles.expenseText
      ]}>
        {item.type === 'income' ? '+' : '-'}฿{item.amount.toLocaleString()}
      </Text>
    </View>
  );

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction', { 
      pocketId: pocket.id,
      category: pocket.category 
    });
  };

  const handleDeletePocket = () => {
    Alert.alert(
      'Delete Pocket',
      'Are you sure you want to delete this pocket? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await deletePocket(pocket.id);
            if (success) {
              navigation.goBack();
            }
          }
        },
      ]
    );
  };

  const renderCategorySpecificActions = () => {
    switch (pocket.category) {
      case 'bills':
        return (
          <View style={styles.billsContainer}>
            <View style={styles.billCard}>
              <Text style={styles.billAmountLabel}>Bill Amount</Text>
              <Text style={styles.billAmount}>฿{pocket.goal.toLocaleString()}</Text>
              <Text style={styles.dueDateText}>Due in {pocket.dueDate} days</Text>
            </View>
            <TouchableOpacity 
              style={[styles.actionButton, styles.payButton]}
              onPress={() => {
                Alert.alert(
                  'Pay Bill',
                  `Pay ฿${pocket.goal.toLocaleString()}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Pay',
                      onPress: async () => {
                        try {
                          await updatePocket(pocket.id, {
                            ...pocket,
                            paid: true,
                            lastPaidDate: new Date().toISOString()
                          });
                          Alert.alert('Success', 'Bill has been paid!');
                          navigation.goBack();
                        } catch (error) {
                          Alert.alert('Error', 'Failed to process payment');
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.actionButtonText}>Pay Bill</Text>
            </TouchableOpacity>
          </View>
        );
      case 'saving':
        return (
          <View style={styles.savingInfo}>
            <Text style={styles.savingLabel}>Target: ฿{pocket.goal.toLocaleString()}</Text>
            <Text style={styles.savingLabel}>
              Remaining: ฿{(pocket.goal - pocket.currentAmount).toLocaleString()}
            </Text>
          </View>
        );
      case 'expense':
        return (
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetLabel}>Budget: ฿{pocket.goal.toLocaleString()}</Text>
            <Text style={styles.budgetLabel}>
              Remaining: ฿{pocket.currentAmount.toLocaleString()}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.title}>{pocket?.name || 'Boat Nom Naaaa'}</Text>
        
        <TouchableOpacity
          onPress={handleDeletePocket}
          style={styles.deleteButton}
        >
          <Icon name="trash-outline" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {pocket.category === 'bills' ? (
          renderCategorySpecificActions()
        ) : (
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>฿{pocket.currentAmount.toLocaleString()}</Text>
              {renderProgressBar()}
            </View>

            {renderCategorySpecificActions()}

            <View style={styles.transactionsHeader}>
              <Text style={styles.sectionTitle}>Transactions</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddTransaction}
              >
                <Ionicons name="add-circle" size={24} color="#8A2BE2" />
                <Text style={styles.addButtonText}>Add Transaction</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={pocket.transactions}
              renderItem={renderTransactionItem}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No transactions yet</Text>
              }
              scrollEnabled={false}
            />
          </>
        )}
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
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressBarExpense: {
    backgroundColor: '#ff4444',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#ff4444',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  payButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingInfo: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  savingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  budgetInfo: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  budgetLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  billsContainer: {
    flex: 1,
    padding: 20,
  },
  billCard: {
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  billAmountLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  billAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  dueDateText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
}); 