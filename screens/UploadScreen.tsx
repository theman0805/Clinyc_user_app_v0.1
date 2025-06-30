import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Card, Portal, Modal, TextInput } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { uploadDocument, saveDocumentMetadata } from '../services/supabase';
import { supabase } from '../services/supabase';

// Define the document picker result type
type DocumentPickerResult = {
  canceled: boolean;
  assets?: Array<{
    uri: string;
    name: string;
    mimeType?: string;
    size?: number;
  }>;
};

export default function UploadScreen() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResult | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      setSelectedFile(result);
      setDocumentName(result.assets[0].name);
      setShowMetadataModal(true);
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const handleUpload = async () => {
    if (!user || !selectedFile || !selectedFile.assets?.[0]) {
      Alert.alert('Error', 'Please select a document first');
      return;
    }

    try {
      setUploading(true);

      // Upload the file to Supabase Storage
      const { path, error: uploadError, publicUrl } = await uploadDocument(
        user.id,
        selectedFile.assets[0].uri,
        selectedFile.assets[0]
      );

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(typeof uploadError === 'string' ? uploadError : 'Upload failed');
      }

      if (!path) {
        throw new Error('Failed to upload document');
      }

      // Save document metadata
      const { error: metadataError } = await saveDocumentMetadata(
        user.id,
        selectedCaseId || 'uncategorized',
        documentName,
        path,
        selectedFile.assets[0].mimeType || 'application/octet-stream',
        selectedFile.assets[0].size || 0,
        documentDescription
      );

      if (metadataError) {
        console.error('Metadata error details:', metadataError);
        // If metadata save fails, we should clean up the uploaded file
        try {
          await supabase.storage
            .from('user-files')
            .remove([path]);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded file:', cleanupError);
        }
        throw new Error(typeof metadataError === 'string' ? metadataError : 'Failed to save metadata');
      }

      Alert.alert(
        'Success',
        'Document uploaded successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              // Optionally refresh the documents list if you have one
            }
          }
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed',
        error instanceof Error ? error.message : 'Failed to upload document'
      );
    } finally {
      setUploading(false);
      setShowMetadataModal(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentName('');
    setDocumentDescription('');
    setSelectedCaseId(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Upload Documents" />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.description}>
            Upload your medical documents, reports, or images. We support PDF, images, and text files.
          </Text>

          <View style={styles.uploadArea}>
            <Button
              mode="contained"
              icon={() => <Ionicons name="cloud-upload" size={24} color="white" />}
              onPress={handleSelectDocument}
              style={styles.uploadButton}
              loading={uploading}
              disabled={uploading}
            >
              Select Document
            </Button>
          </View>

          {selectedFile?.assets?.[0] && (
            <View style={styles.selectedFile}>
              <Ionicons name="document" size={24} color="#1A5D1A" />
              <Text style={styles.fileName}>{selectedFile.assets[0].name}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={showMetadataModal}
          onDismiss={() => setShowMetadataModal(false)}
          contentContainerStyle={styles.modal}
        >
          <View>
            <Text variant="headlineSmall" style={styles.modalTitle}>Document Details</Text>
            
            <TextInput
              label="Document Name"
              value={documentName}
              onChangeText={setDocumentName}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Description (optional)"
              value={documentDescription}
              onChangeText={setDocumentDescription}
              multiline
              numberOfLines={3}
              style={styles.input}
              mode="outlined"
            />
            
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowMetadataModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleUpload}
                style={styles.modalButton}
                loading={uploading}
                disabled={uploading || !documentName.trim()}
              >
                Upload
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  uploadArea: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#1A5D1A',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginVertical: 16,
  },
  uploadButton: {
    backgroundColor: '#1A5D1A',
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  fileName: {
    marginLeft: 8,
    flex: 1,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
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
    marginLeft: 8,
  },
}); 