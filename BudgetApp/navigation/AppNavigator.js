import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen.js';
import AccountScreen from '../screens/AccountScreen.js';
import AnalysisScreen from '../screens/AnalysisScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
import PocketDetailsScreen from '../screens/PocketDetails.js';
import CreatePocketScreen from '../screens/CreatePocketScreen.js';
import AddTransactionScreen from '../screens/AddTransaction.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Account':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Analysis':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main stack navigator
export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Auth"
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="PocketDetails" 
        component={PocketDetailsScreen}
        options={{
          presentation: 'card',
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="CreatePocket" 
        component={CreatePocketScreen}
        options={{
          presentation: 'modal',
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{
          presentation: 'modal',
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}