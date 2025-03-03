import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function CustomButton({ 
  onPress, 
  title, 
  loading = false, 
  disabled = false,
  type = 'primary', // primary, secondary, danger
  size = 'medium' // small, medium, large
}) {
  const getButtonStyle = () => {
    let style = [styles.button];
    
    if (type === 'secondary') style.push(styles.secondaryButton);
    if (type === 'danger') style.push(styles.dangerButton);
    if (size === 'small') style.push(styles.smallButton);
    if (size === 'large') style.push(styles.largeButton);
    if (disabled || loading) style.push(styles.disabledButton);
    
    return style;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[
          styles.buttonText,
          type === 'secondary' && styles.secondaryButtonText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  smallButton: {
    padding: 10,
  },
  largeButton: {
    padding: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
}); 