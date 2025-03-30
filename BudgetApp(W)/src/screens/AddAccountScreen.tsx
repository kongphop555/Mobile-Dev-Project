import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MainTabNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building,
  PiggyBank,
  DollarSign,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ACCOUNT_TYPES = [
  { id: 'checking', icon: CreditCard, label: 'Checking Account' },
  { id: 'savings', icon: PiggyBank, label: 'Savings Account' },
  { id: 'credit', icon: Wallet, label: 'Credit Card' },
  { id: 'investment', icon: DollarSign, label: 'Investment Account' },
  { id: 'cash', icon: Wallet, label: 'Cash' },
];

export default function AddAccountScreen() {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { colors } = useTheme();
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState('');
  const [selectedType, setSelectedType] = useState('checking');

  const handleSave = () => {
    // TODO: Implement account saving logic
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.surface }]}>
          Add Account
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Account Type</Text>
          <View style={styles.accountTypesContainer}>
            {ACCOUNT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.accountTypeButton,
                    {
                      backgroundColor:
                        selectedType === type.id
                          ? colors.primary
                          : colors.glass.background,
                      borderColor:
                        selectedType === type.id
                          ? colors.primary
                          : colors.glass.border,
                    },
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Icon
                    size={24}
                    color={selectedType === type.id ? colors.surface : colors.text}
                  />
                  <Text
                    style={[
                      styles.accountTypeText,
                      {
                        color:
                          selectedType === type.id ? colors.surface : colors.text,
                      },
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Account Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter account name"
            placeholderTextColor={colors.textSecondary}
            value={accountName}
            onChangeText={setAccountName}
          />

          <Text style={[styles.label, { color: colors.text }]}>Initial Balance</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glass.background,
                borderColor: colors.glass.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter initial balance"
            placeholderTextColor={colors.textSecondary}
            value={balance}
            onChangeText={setBalance}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>
              Save Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  accountTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  accountTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: (width - 48) / 2,
  },
  accountTypeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 