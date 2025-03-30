import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MainTabNavigationProp } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Settings,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Crown,
  LogOut,
} from 'lucide-react-native';

type Props = {
  navigation: MainTabNavigationProp;
};

export default function ProfileScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile pressed');
  };

  const menuItems = [
    {
      title: 'Premium Account',
      icon: Crown,
      color: colors.gold,
      badge: 'ELITE',
      description: 'Access exclusive features',
      onPress: () => navigation.navigate('AddAccount'),
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      color: colors.primary,
      description: '3 cards connected',
      onPress: () => navigation.navigate('Cards'),
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: colors.secondary,
      description: 'Customize alerts',
      onPress: () => {
        // TODO: Navigate to notifications screen when available
        console.log('Notifications pressed');
      },
    },
    {
      title: 'Security',
      icon: Shield,
      color: colors.success,
      description: '2FA enabled',
      onPress: () => {
        // TODO: Navigate to security screen when available
        console.log('Security pressed');
      },
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      color: colors.accent,
      description: '24/7 premium support',
      onPress: () => {
        // TODO: Navigate to help screen when available
        console.log('Help & Support pressed');
      },
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.surface }]}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
              />
            ) : (
              <User size={40} color={colors.primary} />
            )}
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          </View>
          <Text style={[styles.userName, { color: colors.surface }]}>
            {user?.displayName || 'John Williams'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.surface }]}>
            {user?.email || 'john.williams@example.com'}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.editButtonText, { color: colors.surface }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statsValue, { color: colors.text }]}>$24,500</Text>
          <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Total Savings</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statsValue, { color: colors.text }]}>85%</Text>
          <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Goals Achieved</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={[styles.menuContainer, { backgroundColor: colors.surface }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index !== menuItems.length - 1 && styles.menuItemBorder,
              { borderBottomColor: colors.border }
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
            </View>
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={[styles.badge, { backgroundColor: colors.goldLight }]}>
                  <Text style={[styles.badgeText, { color: colors.gold }]}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: colors.surface }]}
        onPress={signOut}
      >
        <LogOut size={20} color={colors.danger} />
        <Text style={[styles.signOutText, { color: colors.danger }]}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
    marginTop: -30,
  },
  statsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
  },
  menuContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  signOutButton: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 