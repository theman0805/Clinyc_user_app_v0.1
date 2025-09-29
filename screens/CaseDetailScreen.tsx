import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../types/navigation';
import { supabase } from '../services/supabase';


type CaseDetailRouteProp = RouteProp<MainStackParamList, 'CaseDetail'>;

export default function CaseDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<CaseDetailRouteProp>();
  const { caseId } = route.params;

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  const loadCaseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data: c, error: e1 } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();
      if (e1) throw e1;
      setCaseData(c);

      const { data: docs, error: e2 } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      if (e2) throw e2;
      setDocuments(docs || []);
    } catch (err) {
      console.error('Failed to load case details', err);
      Alert.alert('Error', 'Failed to load case details');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    loadCaseDetails();
  }, [loadCaseDetails]);

  const openDocument = (item: any) => {
    const filePath = item.file_path || item.storage_path;
    const mimeType = item.mime_type || item.file_type || 'application/octet-stream';
    const title = item.title || item.name || 'Document';

    if (!filePath) {
      Alert.alert('Missing file', 'This document has no file path');
      return;
    }

    (navigation as any).navigate('DocumentViewer' as never, {
      filePath,
      mimeType,
      title,
    } as never);
  };

  const renderDoc = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.docRow} onPress={() => openDocument(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.docTitle}>{item.title || item.name || 'Document'}</Text>
        <Text style={styles.docMeta}>
          {(item.mime_type || item.file_type || 'Unknown')} · {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.docAction}>View</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#1A5D1A" />
        <Text style={styles.loadingText}>Loading case...</Text>
      </SafeAreaView>
    );
  }

  if (!caseData) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Case not found</Text>
        <TouchableOpacity onPress={() => (navigation as any).goBack()}>
          <Text style={styles.link}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).goBack()}>
          <Text style={styles.link}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{caseData.title || 'Case Details'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          {caseData.description ? (
            <Text style={styles.body}>{caseData.description}</Text>
          ) : (
            <Text style={styles.muted}>No description</Text>
          )}
          <Text style={styles.meta}>Created: {new Date(caseData.created_at).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Documents</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Upload' as never, { caseId } as never)}>
              <Text style={styles.link}>Add</Text>
            </TouchableOpacity>
          </View>

          {documents.length === 0 ? (
            <Text style={styles.muted}>No documents yet</Text>
          ) : (
            <FlatList
              data={documents}
              keyExtractor={(it) => String(it.id)}
              renderItem={renderDoc}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 8, color: '#666' },
  errorText: { color: '#c00', marginBottom: 10 },
  link: { color: '#1A5D1A', fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333', maxWidth: '70%' },
  section: { backgroundColor: '#fff', margin: 12, padding: 12, borderRadius: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#333' },
  body: { color: '#333', marginBottom: 8 },
  muted: { color: '#777' },
  meta: { color: '#777', marginTop: 6 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  docRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  docTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  docMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  docAction: { color: '#1A5D1A', fontWeight: '600' },
});
