import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

export default function ProfileScreen({ navigation }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState(null); // Add state for profile image
  const { user } = useUser();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Reset navigation state and navigate to Auth
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              })
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleNotificationToggle = () => {
    setIsNotificationsEnabled(previousState => !previousState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.content}>
          <View style={styles.profileHeader}>
          <Image
              source={profileImage ? { uri: profileImage } : require('../assets/images/default-profile.png')}
              style={styles.profilePicture}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Winnie</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>

          {/* Subscription Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <TouchableOpacity onPress={() => alert('Premium Member clicked!')}>
              <Text style={styles.subscriptionStatus}>Premium Member</Text>
            </TouchableOpacity>
          </View>


          {/* Edit Account Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="pencil" size={20} color="#333" />
              <Text style={styles.editButtonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditPassword')}>
              <Ionicons name="lock-closed-outline" size={20} color="#333" />
              <Text style={styles.editButtonText}>Password</Text>
            </TouchableOpacity>
          </View>

          {/* Edit Security Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ChangePin')}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#333" />
              <Text style={styles.editButtonText}>Change PIN</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.notificationToggle}>
              <Text style={styles.notificationText}>Enable Notifications</Text>
              <Switch
                value={isNotificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#d3d3d3', true: '#4cd137' }}
                thumbColor={isNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingLeft: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flexDirection: 'column',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subscriptionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFC107',
    borderRadius: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 8,
  },
  notificationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
