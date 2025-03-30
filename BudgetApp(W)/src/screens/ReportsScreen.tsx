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
  BarChart2,
  PieChart,
  TrendingUp,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const REPORT_TYPES = [
  {
    id: 'expenses',
    icon: 'trending-down-outline',
    label: 'Expenses',
    amount: 2340.00,
    change: -12.5,
  },
  {
    id: 'income',
    icon: 'trending-up-outline',
    label: 'Income',
    amount: 6520.00,
    change: 8.3,
  },
  {
    id: 'savings',
    icon: 'wallet-outline',
    label: 'Savings',
    amount: 4180.00,
    change: 15.7,
  },
  {
    id: 'investments',
    icon: 'bar-chart-outline',
    label: 'Investments',
    amount: 12500.00,
    change: 5.2,
  },
];

const CATEGORIES = [
  { id: 'shopping', name: 'Shopping', amount: 850.00, percentage: 35 },
  { id: 'food', name: 'Food & Drinks', amount: 620.00, percentage: 25 },
  { id: 'transport', name: 'Transport', amount: 450.00, percentage: 20 },
  { id: 'utilities', name: 'Utilities', amount: 320.00, percentage: 15 },
  { id: 'others', name: 'Others', amount: 100.00, percentage: 5 },
];

export default function ReportsScreen() {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [timeRange, setTimeRange] = useState('This Month');
  const [chartType, setChartType] = useState('expenses');

  // Mock data
  const spendingByCategory = [
    { category: 'Shopping', amount: 2450.80, percentage: 35 },
    { category: 'Food & Drinks', amount: 1850.50, percentage: 25 },
    { category: 'Transportation', amount: 950.30, percentage: 15 },
    { category: 'Entertainment', amount: 750.20, percentage: 12 },
    { category: 'Others', amount: 650.70, percentage: 13 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF8F3F', '#E67E38']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Reports</Text>
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriod,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.selectedPeriodText,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.reportGrid}>
          {REPORT_TYPES.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => {
                // Navigate to detailed report
              }}
            >
              <LinearGradient
                colors={['rgba(255, 143, 63, 0.1)', 'rgba(230, 126, 56, 0.1)']}
                style={styles.reportGradient}
              >
                <View style={styles.reportIcon}>
                  <Ionicons name={report.icon as any} size={24} color="#FF8F3F" />
                </View>
                <Text style={styles.reportLabel}>{report.label}</Text>
                <Text style={styles.reportAmount}>${report.amount.toFixed(2)}</Text>
                <View
                  style={[
                    styles.changeIndicator,
                    { backgroundColor: report.change > 0 ? '#4CAF5015' : '#F4433615' },
                  ]}
                >
                  <Ionicons
                    name={report.change > 0 ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color={report.change > 0 ? '#4CAF50' : '#F44336'}
                  />
                  <Text
                    style={[
                      styles.changeText,
                      { color: report.change > 0 ? '#4CAF50' : '#F44336' },
                    ]}
                  >
                    {Math.abs(report.change)}%
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          {CATEGORIES.map((category) => (
            <View key={category.id} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBar, { width: `${category.percentage}%` }]}
                />
                <Text style={styles.percentageText}>{category.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriod: {
    backgroundColor: '#FFFFFF',
  },
  periodText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectedPeriodText: {
    color: '#FF8F3F',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  reportCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  reportGradient: {
    padding: 16,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 143, 63, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  reportAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#FF8F3F',
    borderRadius: 4,
  },
  percentageText: {
    position: 'absolute',
    right: -24,
    top: -3,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
}); 