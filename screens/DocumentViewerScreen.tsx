import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Dimensions, Alert, ScrollView, Button, Linking, Text } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../types/navigation';
import { getSignedUrlForUserFile } from '../services/supabase';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

type DocumentViewerRoute = RouteProp<MainStackParamList, 'DocumentViewer'>;

export default function DocumentViewerScreen() {
  const route = useRoute<DocumentViewerRoute>();
  const navigation = useNavigation();
  const { filePath, mimeType, title } = route.params || ({} as any);

  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions?.({ headerShown: false as any });
  }, [navigation]);

  useEffect(() => {
    const init = async () => {
      if (!filePath) {
        setError('Missing file path');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await getSignedUrlForUserFile(filePath, 3600);
        if (error || !data?.signedUrl) {
          setError('Failed to create signed URL');
        } else {
          setSignedUrl(data.signedUrl);
        }
      } catch (e: any) {
        setError(e?.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [filePath]);

  const openExternal = async () => {
    if (!signedUrl) return;
    const supported = await Linking.canOpenURL(signedUrl);
    if (supported) {
      Linking.openURL(signedUrl);
    } else {
      Alert.alert('Unable to open', 'No app can handle this file type.');
    }
  };

  // Simple type checks
  const isImage = (mimeType || '').startsWith('image/');
  const isPDF = (mimeType || '') === 'application/pdf';

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1A5D1A" />
        <Text style={styles.loadingText}>Loading document...</Text>
      </View>
    );
  }

  if (error || !signedUrl) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Unable to load document'}</Text>
        <Button title="Go Back" onPress={() => (navigation as any).goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Back" onPress={() => (navigation as any).goBack()} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || 'Document'}
        </Text>
        <View style={{ width: 64 }} />
      </View>

      {isImage ? (
        <ScrollView contentContainerStyle={styles.viewerContainer}>
          <Image
            source={{ uri: signedUrl }}
            resizeMode="contain"
            style={{ width: windowWidth, height: windowHeight * 0.75 }}
          />
        </ScrollView>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.infoText}>
            This file type cannot be previewed in-app.
          </Text>
          <Button title={isPDF ? 'Open PDF' : 'Open Externally'} onPress={openExternal} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#333', maxWidth: windowWidth - 160 },
  viewerContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  loadingText: { marginTop: 12, color: '#666' },
  errorText: { marginBottom: 12, color: '#c00' },
  infoText: { marginBottom: 12, color: '#444' },
});
