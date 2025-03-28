import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePockets } from '../context/PocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('saving');
  const { getPocketsByCategory } = usePockets();

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeCategory === 'saving' && styles.activeTab]}
        onPress={() => setActiveCategory('saving')}
      >
        <Text style={[styles.tabText, activeCategory === 'saving' && styles.activeTabText]}>Saving</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeCategory === 'expense' && styles.activeTab]}
        onPress={() => setActiveCategory('expense')}
      >
        <Text style={[styles.tabText, activeCategory === 'expense' && styles.activeTabText]}>Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeCategory === 'bills' && styles.activeTab]}
        onPress={() => setActiveCategory('bills')}
      >
        <Text style={[styles.tabText, activeCategory === 'bills' && styles.activeTabText]}>Bills</Text>
      </TouchableOpacity>
    </View>
  );

  const PocketCard = ({ pocket, onPress }) => {
    const renderContent = () => {
      switch (pocket.category) {
        case 'bills':
          return (
            <>
              <Text style={styles.pocketAmount}>฿{pocket.goal.toLocaleString()}</Text>
              <Text style={styles.pocketGoal}>Due in {pocket.dueDate} days</Text>
            </>
          );
        case 'expense':
          return (
            <>
              <Text style={styles.pocketAmount}>฿{pocket.currentAmount.toLocaleString()}</Text>
              <Text style={styles.pocketGoal}>Budget: ฿{pocket.goal.toLocaleString()}</Text>
            </>
          );
        default: // saving
          return (
            <>
              <Text style={styles.pocketAmount}>฿{pocket.currentAmount.toLocaleString()}</Text>
              <Text style={styles.pocketGoal}>Goal: ฿{pocket.goal.toLocaleString()}</Text>
            </>
          );
      }
    };

    return (
      <TouchableOpacity style={styles.pocketCard} onPress={() => onPress(pocket)}>
        <View style={styles.pocketHeader}>
          <Text style={styles.pocketName}>{pocket.name}</Text>
          <Ionicons name="chevron-forward" size={24} color="#8A2BE2" />
        </View>
        {renderContent()}
      </TouchableOpacity>
    );
  };

  const pockets = getPocketsByCategory(activeCategory);

  const handlePocketPress = (pocket) => {
    if (!pocket || !pocket.id) {
      console.error('Invalid pocket data:', pocket);
      return;
    }
    
    navigation.navigate('PocketDetails', {
      pocketId: pocket.id,
      name: pocket.name // Add name for better UX
    });
  };

  const debugStorage = async () => {
    const storedPockets = await AsyncStorage.getItem('@pockets');
    console.log('Stored pockets:', JSON.parse(storedPockets));
  };

  useEffect(() => {
    debugStorage();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Account</Text>
      </View>

      {renderTabs()}

      <FlatList
        data={pockets}
        renderItem={({ item }) => (
          <PocketCard pocket={item} onPress={handlePocketPress} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.pocketsList}
        ListHeaderComponent={() => (
          <TouchableOpacity 
            style={styles.createPocketButton}
            onPress={() => navigation.navigate('CreatePocket', { category: activeCategory })}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.createPocketText}>Create New Pocket</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingLeft: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#8A2BE2',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  pocketsList: {
    padding: 16,
  },
  createPocketButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  createPocketText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pocketCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pocketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pocketName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pocketAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  pocketGoal: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
}); 