import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePockets } from '../context/PocketContext';

const CategoryTabs = ['Expenses', 'Income', 'Savings'];
const PeriodTabs = ['Week', 'Month', 'Year']; 

export default function AnalysisScreen() {
  const { pockets } = usePockets();
  const [selectedCategory, setSelectedCategory] = useState('Expenses');
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
 
  useEffect(() => {
    const filteredPockets = pockets.filter(pocket => {
      if (selectedCategory === 'Expenses') return pocket.category === 'expense' || pocket.category === 'bills';
      if (selectedCategory === 'Income') return pocket.category === 'income';
      return pocket.category === 'savings';
    });

    const sortedPockets = [...filteredPockets].sort((a, b) => b.currentAmount - a.currentAmount);
    const calculatedTotal = sortedPockets.reduce((sum, pocket) => sum + pocket.currentAmount, 0);
    setTotal(calculatedTotal);
    setData(sortedPockets);
  }, [selectedCategory, selectedPeriod, pockets]);

  const renderTabs = (tabs, selectedTab, onSelect) => (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selectedTab === tab && styles.selectedTab]}
          onPress={() => onSelect(tab)}
        >
          <Text style={[styles.tabText, selectedTab === tab && styles.selectedTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const generateColorScale = (num) => {
    const baseColor = [148, 255, 212]; // Base color
    return Array.from({ length: num }, (_, i) => {
      const factor = 1 - i / num;
      return `rgb(${Math.floor(baseColor[0] * factor)}, 
                  ${Math.floor(baseColor[1] * factor)}, 
                  ${Math.floor(baseColor[2] * factor)})`; 
    });
  };

  const colors = generateColorScale(data.length);

  const pieChartData = data.map((pocket, index) => ({
    name: pocket.name,
    population: pocket.currentAmount,
    color: colors[index],
  }));

  const renderPocketItem = (pocket) => (
    <View key={pocket.id} style={styles.pocketItem}>
      <View style={[styles.pocketColor, { backgroundColor: colors[data.indexOf(pocket)] }]} />
      <View style={styles.pocketDetails}>
        <Text style={styles.pocketName}>{pocket.name}</Text>
        <Text style={styles.pocketAmount}>฿{pocket.currentAmount.toLocaleString()}</Text>
      </View>
      <Text style={styles.percentageText}>
        {((pocket.currentAmount / total) * 100).toFixed(2)}%
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Financial Analysis</Text>
      {renderTabs(CategoryTabs, selectedCategory, setSelectedCategory)}
      {renderTabs(PeriodTabs, selectedPeriod, setSelectedPeriod)}

      <View style={styles.pieChartContainer}>
        <PieChart
          data={pieChartData}
          width={300}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          
          accessor="population"
          backgroundColor="transparent"
          center={[75, 0]} 
          hasLegend={false} 
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total {selectedCategory}</Text>
          <Text style={styles.totalAmount}>฿{total.toLocaleString()}</Text>
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Breakdown</Text>
          {data.map(renderPocketItem)}
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#8A2BE2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedTabText: {
    color: '#FFF',
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  totalSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  breakdownSection: {
    flex: 1,
  },
  breakdownTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pocketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  pocketColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  pocketDetails: {
    flex: 1,
  },
  pocketName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  pocketAmount: {
    fontSize: 14,
    color: '#666',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 12,
  }
});