import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Button, Card, TextInput, Text, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { fetchUserCases, createCase } from '../services/supabase';
import { MedicalCase } from '../types';

export default function CasesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDescription, setNewCaseDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Load user's cases
  const loadCases = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await fetchUserCases(user.id);

      if (error) {
        console.error('Error fetching cases:', error);
        Alert.alert('Error', 'Failed to load cases');
      } else if (data) {
        setCases(data as MedicalCase[]);
      }
    } catch (error) {
      console.error('Unexpected error loading cases:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh cases list
  const handleRefresh = () => {
    setRefreshing(true);
    loadCases();
  };

  // Load cases on mount
  useEffect(() => {
    loadCases();
  }, [user]);

  // Handle case creation
  const handleCreateCase = async () => {
    if (!user) return;
    if (!newCaseTitle.trim()) {
      Alert.alert('Error', 'Please enter a case title');
      return;
    }

    try {
      setCreating(true);
      const { data, error } = await createCase(
        user.id,
        newCaseTitle.trim(),
        newCaseDescription.trim() || undefined
      );

      if (error) {
        console.error('Error creating case:', error);
        Alert.alert('Error', 'Failed to create the case');
      } else if (data) {
        setCases(prevCases => [data as MedicalCase, ...prevCases]);
        setShowNewCaseModal(false);
        setNewCaseTitle('');
        setNewCaseDescription('');
        Alert.alert('Success', 'Case created successfully');
      }
    } catch (error) {
      console.error('Unexpected error creating case:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setCreating(false);
    }
  };

  // Navigate to case details
  const handleCasePress = (caseItem: MedicalCase) => {
    // Navigate to case details screen
    // @ts-ignore - Navigation type will be handled properly in a full implementation
    navigation.navigate('CaseDetail', { caseId: caseItem.id });
  };

  // Close the new case modal and reset form
  const closeModal = () => {
    setShowNewCaseModal(false);
    setNewCaseTitle('');
    setNewCaseDescription('');
  };

  // Render a case item
  const renderCaseItem = ({ item }: { item: MedicalCase }) => (
    <TouchableOpacity onPress={() => handleCasePress(item)}>
      <Card style={styles.caseCard}>
        <Card.Content>
          <View style={styles.caseHeader}>
            <View>
              <Text variant="titleMedium" style={styles.caseTitle}>{item.title}</Text>
              <Text variant="bodySmall" style={styles.caseDate}>
                Created: {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, styles[`status_${item.status}`]]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          {item.description && (
            <Text variant="bodyMedium" style={styles.caseDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.caseFooter}>
            <View style={styles.documentCount}>
              <Ionicons name="document-text-outline" size={16} color="#666" />
              <Text style={styles.documentCountText}>
                {item.documents?.length || 0} documents
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="folder-open-outline" size={80} color="#ccc" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>No Cases Yet</Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        Create your first case to start organizing your medical records
      </Text>
      <Button
        mode="contained"
        icon={() => <Ionicons name="add-circle-outline" size={20} color="white" />}
        style={styles.createButton}
        onPress={() => setShowNewCaseModal(true)}
      >
        Create Case
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Cases</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowNewCaseModal(true)}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A5D1A" />
          <Text style={styles.loadingText}>Loading cases...</Text>
        </View>
      ) : (
        <FlatList
          data={cases}
          keyExtractor={(item) => item.id}
          renderItem={renderCaseItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={EmptyState}
        />
      )}

      {/* New Case Modal */}
      <Portal>
        <Modal
          visible={showNewCaseModal}
          onDismiss={closeModal}
          contentContainerStyle={styles.modal}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Create New Case</Text>
          
          <TextInput
            label="Case Title"
            value={newCaseTitle}
            onChangeText={setNewCaseTitle}
            left={<TextInput.Icon icon="folder-outline" />}
            autoCapitalize="sentences"
            disabled={creating}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Description (optional)"
            value={newCaseDescription}
            onChangeText={setNewCaseDescription}
            left={<TextInput.Icon icon="text" />}
            multiline
            numberOfLines={3}
            disabled={creating}
            style={styles.input}
            mode="outlined"
          />
          
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={closeModal}
              style={styles.modalButton}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateCase}
              style={styles.modalButton}
              loading={creating}
              disabled={creating || !newCaseTitle.trim()}
            >
              {creating ? "Creating..." : "Create Case"}
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A5D1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  caseCard: {
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  caseTitle: {
    color: '#333',
  },
  caseDate: {
    color: '#888',
    marginTop: 4,
  },
  statusContainer: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  status_active: {
    color: '#1A5D1A',
  },
  status_resolved: {
    color: '#4CAF50',
  },
  status_archived: {
    color: '#9E9E9E',
  },
  caseDescription: {
    color: '#666',
    marginVertical: 8,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  documentCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentCountText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    marginTop: 16,
    backgroundColor: '#1A5D1A',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 10,
    minWidth: 100,
  },
}); 