import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function TransactionHistory({ transactions, timeFrame }) {
  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <FlatList
      data={Object.entries(groupedTransactions)}
      keyExtractor={([date]) => date}
      renderItem={({ item: [date, dayTransactions] }) => (
        <View style={styles.dayGroup}>
          <Text style={styles.dateHeader}>{formatDate(date)}</Text>
          {dayTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </View>
      )}
    />
  );
} 