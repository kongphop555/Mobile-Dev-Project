import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExpenseItem = ({ expense }) => (
  <View style={styles.container}>
    <Text style={styles.category}>{expense.category}</Text>
    <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  category: {
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseItem;