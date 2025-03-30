"use client"

import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider, useTheme } from "./src/context/ThemeContext"
import { AuthProvider, useAuth } from "./src/context/AuthContext"
import { Wallet, CreditCard, Receipt, PlusCircle, PieChart, User } from "lucide-react-native"
import { RootStackParamList, AuthStackParamList, MainTabParamList, AppStackParamList } from "./src/types/navigation"

// Screens
import OnboardingScreen from "./src/screens/OnboardingScreen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen"
import DashboardScreen from "./src/screens/DashboardScreen"
import AccountsScreen from "./src/screens/AccountsScreen"
import BillsScreen from "./src/screens/BillsScreen"
import AddTransactionScreen from "./src/screens/AddTransactionScreen"
import ReportsScreen from "./src/screens/ReportsScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import CategoriesScreen from "./src/screens/CategoriesScreen"
import TransactionsScreen from "./src/screens/TransactionsScreen"
import TransactionDetailsScreen from "./src/screens/TransactionDetailsScreen"
import CategoryDetailsScreen from "./src/screens/CategoryDetailsScreen"
import BillDetailsScreen from "./src/screens/BillDetailsScreen"
import AddBillScreen from "./src/screens/AddBillScreen"
import CardsScreen from "./src/screens/CardsScreen"
import SavingsScreen from "./src/screens/SavingsScreen"
import AddAccountScreen from "./src/screens/AddAccountScreen"
import EditProfileScreen from "./src/screens/EditProfileScreen"
import NotificationsScreen from "./src/screens/NotificationsScreen"
import SecurityScreen from "./src/screens/SecurityScreen"
import HelpSupportScreen from "./src/screens/HelpSupportScreen"

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<MainTabParamList>()
const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const AppStack = createNativeStackNavigator<AppStackParamList>()

function MainTabs() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#333',
          height: 65,
          paddingBottom: 10,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'System',
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <Wallet color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          tabBarIcon: ({ color }) => <CreditCard color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{
          tabBarIcon: ({ color }) => <Receipt color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color }) => <PieChart color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  )
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  )
}

function AppNavigator() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    console.log('App is loading...');
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen 
              name="Auth" 
              component={AuthNavigator}
              listeners={{
                focus: () => console.log('Auth navigator focused')
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabs}
              listeners={{
                focus: () => console.log('Main screen focused')
              }}
            />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
            <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
            <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
            <Stack.Screen name="BillDetails" component={BillDetailsScreen} />
            <Stack.Screen name="AddBill" component={AddBillScreen} />
            <Stack.Screen name="Cards" component={CardsScreen} />
            <Stack.Screen name="Savings" component={SavingsScreen} />
            <Stack.Screen name="AddAccount" component={AddAccountScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

