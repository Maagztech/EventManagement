import { useAuth } from '@/context/authContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const Loading = () => {
  const { isLoading } = useAuth(); // Access global loading state

  if (!isLoading) return null; // Do not render if not loading

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3498DB" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex:10000
  },
  loadingText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
});

export default Loading;
