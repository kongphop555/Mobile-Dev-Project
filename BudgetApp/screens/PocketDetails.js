import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePockets } from '../context/PocketContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from '@expo/vector-icons/Ionicons';

export default function PocketDetails({ route, navigation }) {
  const { pockets, refreshPockets, deletePocket, updatePocket } = usePockets();
  const [currentPocket, setCurrentPocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectPocketModalVisible, setIsSelectPocketModalVisible] = useState(false);
  const [availablePockets, setAvailablePockets] = useState([]);

  const loadPocketData = useCallback(async () => {
    if (!route.params?.pocketId || !pockets) {
      navigation.navigate('Dashboard');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const pocket = pockets.find(p => p.id === route.params.pocketId);
      
      if (!pocket) {
        console.error('Pocket not found:', route.params.pocketId);
        navigation.navigate('Dashboard');
        return;
      }
      
      setCurrentPocket(pocket);
    } catch (error) {
      console.error('Error loading pocket:', error);
      Alert.alert('Error', 'Failed to load pocket details');
      navigation.navigate('Dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [route.params?.pocketId, pockets, navigation]);

  // Use useFocusEffect for screen focus handling
  useFocusEffect(
    useCallback(() => {
      if (!route.params?.pocketId) {
        navigation.navigate('Dashboard');
        return;
      }
      loadPocketData();
    }, [loadPocketData, route.params?.pocketId])
  );

  // Add console log for render
  console.log('Current pocket state:', currentPocket);
  console.log('Loading state:', isLoading);

  // Add null check before accessing currentPocket properties
  const progress = currentPocket?.goal && currentPocket?.currentAmount 
    ? (currentPocket.currentAmount / currentPocket.goal) * 100 
    : 0;

  const showPocketSelectionModal = useCallback(async () => {
    if (!currentPocket) return;

    try {
      // Refresh pockets data first
      await refreshPockets();
      
      // Filter pockets to only show Expense (Budget) pockets with available funds
      const eligiblePockets = pockets.filter(p => 
        p.id !== currentPocket.id && 
        p.category === 'expense' && // Only show expense/budget pockets
        p.currentAmount > 0
      );

      console.log('Available pockets for payment:', eligiblePockets); // Debug log
      setAvailablePockets(eligiblePockets);
      setIsSelectPocketModalVisible(true);
    } catch (error) {
      console.error('Error loading pockets:', error);
      Alert.alert('Error', 'Failed to load available pockets. Please try again.');
    }
  }, [pockets, currentPocket, refreshPockets]);


  // Add this new function to force a complete refresh
  const forceRefresh = async () => {
    try {
      setIsLoading(true);
      await refreshPockets();
      if (route.params?.pocketId) {
        const updatedPocket = pockets.find(p => p.id === route.params.pocketId);
        if (updatedPocket) {
          setCurrentPocket(updatedPocket);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentFromPocket = async (sourcePocket) => {
    try {
      if (!currentPocket || !sourcePocket) return;

      if (sourcePocket.currentAmount < currentPocket.goal) {
        Alert.alert(
          'Insufficient Funds',
          `The selected pocket "${sourcePocket.name}" doesn't have sufficient funds (฿${sourcePocket.currentAmount.toLocaleString()} available, ฿${currentPocket.goal.toLocaleString()} needed).`
        );
        return;
      }


      setIsLoading(true); // Show loading indicator
      const now = new Date();
      const billAmount = currentPocket.goal;
      
      // Create transaction records with more detailed information
      const sourceTransaction = {
        id: Date.now().toString() + '_source',
        amount: billAmount,
        type: 'expense',
        description: `Bill Payment: ${currentPocket.name}`,
        date: now.toISOString(),
        category: 'bill_payment'
      };

      const billTransaction = {
        id: Date.now().toString() + '_bill',
        amount: billAmount,
        type: 'payment',
        description: `Paid from ${sourcePocket.name}`,
        date: now.toISOString(),
        category: 'bill_payment'
      };

      // Update source pocket with new balance and transaction
      const updatedSourcePocket = {
        ...sourcePocket,
        currentAmount: sourcePocket.currentAmount - billAmount,
        transactions: [sourceTransaction, ...(sourcePocket.transactions || [])]
      };

      // Update bill pocket with paid status and transaction
      const updatedBillPocket = {
        ...currentPocket,
        isPaid: true,
        lastPaidDate: now.toISOString(),
        transactions: [billTransaction, ...(currentPocket.transactions || [])]
      };

      // Update both pockets
      await updatePocket(sourcePocket.id, updatedSourcePocket);
      await updatePocket(currentPocket.id, updatedBillPocket);
      
      await refreshPockets(); 
      await loadPocketData();

      setIsSelectPocketModalVisible(false);
      
      Alert.alert(
        'Success', 
        `Bill has been paid successfully using funds from "${sourcePocket.name}"!`,
        [
          {
            text: 'View Source Pocket',
            onPress: async () => {
              await refreshPockets();
              navigation.navigate('PocketDetails', { 
                pocketId: sourcePocket.id
              });
            }
          },
          {
            text: 'Stay Here',
            onPress: async () => {
              await refreshPockets();
              await loadPocketData();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error paying bill:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffect to handle refresh
  useEffect(() => {
    if (route.params?.refresh) {
      forceRefresh();
    }
  }, [route.params?.refresh]);

  // Update useFocusEffect to use forceRefresh
  useFocusEffect(
    useCallback(() => {
      if (!route.params?.pocketId) {
        navigation.navigate('Dashboard');
        return;
      }
      forceRefresh();
    }, [route.params?.pocketId])
  );

  const renderBillStatus = () => {
    if (!currentPocket) return null;

    const isPaid = currentPocket.isPaid;
    const lastPaidDate = currentPocket.lastPaidDate ? new Date(currentPocket.lastPaidDate) : null;

    return (
      <View style={styles.billStatusContainer}>
        <View style={[styles.statusIndicator, isPaid ? styles.paidIndicator : styles.unpaidIndicator]}>
          <Text style={styles.statusText}>
            {isPaid ? 'PAID' : 'UNPAID'}
          </Text>
        </View>
        {lastPaidDate && (
          <Text style={styles.lastPaidText}>
            Last paid: {lastPaidDate.toLocaleDateString()}
          </Text>
        )}
      </View>
    );
  };

  // Show loading state
  if (isLoading || !currentPocket) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </SafeAreaView>
    );
  }

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${Math.min(progress, 100)}%` },
            currentPocket?.category === 'expense' && styles.progressBarExpense
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
    if (!currentPocket) return;
    
    navigation.navigate('AddTransaction', {
      pocketId: currentPocket.id,
      category: currentPocket.category,
    });
  };

  const handleDeletePocket = () => {
    if (!currentPocket) return;

    Alert.alert(
      'Delete Pocket',
      'Are you sure you want to delete this pocket? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deletePocket(currentPocket.id);
              if (success) {
                navigation.navigate('Dashboard');
              } else {
                Alert.alert('Error', 'Failed to delete pocket');
              }
            } catch (error) {
              console.error('Error deleting pocket:', error);
              Alert.alert('Error', 'Failed to delete pocket');
            }
          }
        },
      ]
    );
  };

  // Add a function to handle modal close
  const handleCloseModal = () => {
    setIsSelectPocketModalVisible(false);
  };

  const renderPocketSelectionModal = () => (
    <Modal
      visible={isSelectPocketModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Payment Source</Text>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.modalCloseButton}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>
            Choose a budget pocket to pay ฿{currentPocket?.goal.toLocaleString()}
          </Text>
          
          {availablePockets.length > 0 ? (
            <FlatList
              data={availablePockets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pocketOption}
                  onPress={() => {
                    Alert.alert(
                      'Confirm Payment',
                      `Pay ฿${currentPocket.goal.toLocaleString()} from "${item.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Pay',
                          onPress: () => handlePaymentFromPocket(item)
                        }
                      ]
                    );
                  }}
                >
                  <View>
                    <Text style={styles.pocketName}>{item.name}</Text>
                    <Text style={styles.pocketBalance}>
                      Available: ฿{item.currentAmount.toLocaleString()}
                    </Text>
                  </View>
                  <Icon name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              )}
              style={styles.pocketListContainer}
              contentContainerStyle={styles.pocketList}
              showsVerticalScrollIndicator={true}
            />
          ) : (
            <Text style={styles.noPocketsText}>
              No budget pockets with available funds found. Please add funds to a budget pocket first.
            </Text>
          )}
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCategorySpecificActions = () => {
    switch (currentPocket?.category) {
      case 'bills':
        return (
          <View style={styles.billsContainer}>
            <View style={styles.billCard}>
              <Text style={styles.billAmountLabel}>Bill Amount</Text>
              <Text style={styles.billAmount}>฿{currentPocket.goal.toLocaleString()}</Text>
              {renderBillStatus()}
              <Text style={styles.dueDateText}>
                {currentPocket.dueDate ? `Due in ${currentPocket.dueDate} days` : 'Due date not set'}
              </Text>
            </View>
            {!currentPocket.isPaid && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.payButton]}
                onPress={showPocketSelectionModal}
                activeOpacity={0.7}
              >
                <View style={styles.payButtonContent}>
                  <Icon name="wallet-outline" size={24} color="#fff" style={styles.payButtonIcon} />
                  <Text style={styles.actionButtonText}>Pay Bill</Text>
                </View>
              </TouchableOpacity>
            )}
            {renderPocketSelectionModal()}
          </View>
        );
      case 'saving':
        return (
          <View style={styles.savingInfo}>
            <Text style={styles.savingLabel}>Goal: ฿{currentPocket.goal.toLocaleString()}</Text>
            <Text style={styles.savingLabel}>
              Current balance: ฿{currentPocket.currentAmount.toLocaleString()}
            </Text>
          </View>
        );
      case 'expense':
        return (
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetLabel}>Budget: ฿{currentPocket.goal.toLocaleString()}</Text>
            <Text style={styles.budgetLabel}>
              Remaining: ฿{currentPocket.currentAmount.toLocaleString()}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  // Update the back button handler
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handlePayBill = (billId) => {
    navigation.navigate('PocketDetails', { 
      pocketId: billId
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentPocket ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            
            <Text style={styles.title}>{currentPocket.name}</Text>
            
            <TouchableOpacity
              onPress={handleDeletePocket}
              style={styles.deleteButton}
            >
              <Icon name="trash-outline" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>

          {currentPocket.category === 'bills' ? (
            <View style={styles.content}>
              {renderCategorySpecificActions()}
            </View>
          ) : (
            <FlatList
              data={currentPocket.transactions || []}
              renderItem={renderTransactionItem}
              keyExtractor={item => item.id}
              ListHeaderComponent={() => (
                <>
                  <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Current Balance</Text>
                    <Text style={styles.balanceAmount}>
                      ฿{(currentPocket.currentAmount || 0).toLocaleString()}
                    </Text>
                    {renderProgressBar()}
                  </View>

                  {renderCategorySpecificActions()}

                  <View style={styles.transactionsHeader}>
                    <Text style={styles.sectionTitle}>Transaction History</Text>
                    {!currentPocket.isPaid && (
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={handleAddTransaction}
                      >
                        <Ionicons name="add-circle" size={24} color="#8A2BE2" />
                        <Text style={styles.addButtonText}>Add Transaction</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No transactions yet</Text>
              }
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
        </View>
      )}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  payButton: {
    backgroundColor: '#8A2BE2',
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonIcon: {
    marginRight: 8,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  billAmountLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  billAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  dueDateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billStatusContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  statusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  paidIndicator: {
    backgroundColor: '#4CAF50',
  },
  unpaidIndicator: {
    backgroundColor: '#FF5252',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  lastPaidText: {
    color: '#fff',
    fontSize: 12,
  },
  transactionsList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  pocketOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pocketName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pocketBalance: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pocketListContainer: {
    flexGrow: 0,
    height: '60%',
  },
  pocketList: {
    flexGrow: 1,
  },
  noPocketsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 20,
  },
}); 