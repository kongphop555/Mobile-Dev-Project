import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  Categories: undefined;
  Transactions: undefined;
  TransactionDetails: { id: string };
  CategoryDetails: { id: string };
  BillDetails: { id: string };
  AddBill: undefined;
  Cards: undefined;
  Savings: undefined;
  AddAccount: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Accounts: undefined;
  Bills: undefined;
  Reports: undefined;
  Profile: undefined;
  Categories: undefined;
  Transactions: undefined;
  AddTransaction: undefined;
  Cards: undefined;
  Savings: undefined;
  AddAccount: undefined;
  CategoryDetails: { id: string };
  BillDetails: { id: string };
  AddBill: undefined;
  TransactionDetails: { id: string };
};

// Add a separate type for stack navigation that includes TransactionDetails
export type AppStackParamList = MainTabParamList & {
  TransactionDetails: { id: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = NativeStackNavigationProp<MainTabParamList>;
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>; 