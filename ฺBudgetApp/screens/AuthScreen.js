import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import CustomButton from '../components/CustomButton';
import { useUser } from '../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    try {
      // Simulate authentication
      const userData = {
        email,
        id: 'user-123',
        // Add any other user data you want to store
      };

      // Set the user in context
      setUser(userData);

      // Navigate to main app
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        })
      );
    } catch (error) {
      Alert.alert('Authentication Error', 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
          autoCorrect={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
          autoCorrect={false}
        />

        <TouchableOpacity 
          style={styles.authButton}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
          disabled={loading}
        >
          <Text style={styles.switchButtonText}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#8A2BE2',
    fontSize: 14,
  },
});