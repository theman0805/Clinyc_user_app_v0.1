import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function UploadScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Upload Screen</Text>
      <Text>This screen is being updated to use react-native-paper components.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 