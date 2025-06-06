import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Image } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { fetchUserProfile, Profile } from '../services/supabase';

export default function HomeScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await fetchUserProfile(user.id);
      
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text variant="headlineLarge">Welcome{profile ? `, ${profile.first_name}` : ''}!</Text>
          <Text style={styles.subtitle}>Your personal health dashboard</Text>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Quick Actions" />
          <Card.Content>
            <View style={styles.actionButtons}>
              <Button
                icon={() => <Ionicons name="camera" size={20} color="#ffffff" />}
                mode="contained"
                style={[styles.actionButton, { backgroundColor: '#1A5D1A' }]}
                labelStyle={{ color: '#ffffff' }}
              >
                Capture
              </Button>
              <Button
                icon={() => <Ionicons name="folder-open" size={20} color="#ffffff" />}
                mode="contained"
                style={[styles.actionButton, { backgroundColor: '#3ECF8E' }]}
                labelStyle={{ color: '#ffffff' }}
              >
                New Case
              </Button>
              <Button
                icon={() => <Ionicons name="chatbubbles" size={20} color="#ffffff" />}
                mode="contained"
                style={[styles.actionButton, { backgroundColor: '#1A5D1A' }]}
                labelStyle={{ color: '#ffffff' }}
              >
                Chat
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Recent Documents" />
          <Card.Content>
            <View style={styles.emptyState}>
              <Ionicons
                name="document-outline"
                color="#cccccc"
                size={80}
              />
              <Text style={styles.emptyText}>
                No recent documents found. Upload a document to get started.
              </Text>
              <Button
                mode="contained"
                style={{ backgroundColor: '#1A5D1A', marginTop: 10 }}
              >
                Upload Document
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Insights" />
          <Card.Content>
            <Text style={styles.insightText}>
              Keep track of your medical records and get AI-powered insights from your documents.
            </Text>
            <View style={styles.insightItem}>
              <Ionicons name="bandage" color="#1A5D1A" size={24} />
              <Text style={styles.insightText}>
                Organize your medical documents in one secure place
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="analytics" color="#3ECF8E" size={24} />
              <Text style={styles.insightText}>
                Track your health history over time with smart summaries
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="share-social" color="#1A5D1A" size={24} />
              <Text style={styles.insightText}>
                Securely share your records with healthcare providers
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    borderRadius: 10,
    marginBottom: 16,
    padding: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  insightText: {
    marginBottom: 10,
    flex: 1,
    marginLeft: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
}); 