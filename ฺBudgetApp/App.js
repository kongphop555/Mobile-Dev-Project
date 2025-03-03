import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { PocketProvider } from './context/PocketContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <PocketProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PocketProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}