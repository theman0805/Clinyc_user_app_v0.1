import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { Button, Avatar, Card, TextInput, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { fetchUserProfile, uploadAvatar, Profile } from '../services/supabase';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Editable form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [uploading, setUploading] = useState(false);

  // Load user profile data
  useEffect(() => {
    if (!user) return;
    
    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchUserProfile(user.id);
        
        if (error) {
          console.error('Error fetching profile:', error);
          Alert.alert('Error', 'Failed to load profile data');
        } else if (data) {
          setProfile(data);
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setPhone(data.phone || '');
        }
      } catch (error) {
        console.error('Profile loading error:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);

  // Handle profile picture selection
  const handleSelectImage = async () => {
    if (!user) return;
    
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        
        // Upload the image
        setUploading(true);
        
        // Get file extension
        const fileExt = selectedAsset.uri.split('.').pop();
        const fileName = `${user.id}-avatar.${fileExt}`;
        
        // Create form data for file upload
        const formData = new FormData();
        formData.append('file', {
          uri: selectedAsset.uri,
          name: fileName,
          type: `image/${fileExt}`,
        } as any);
        
        const { data, error } = await uploadAvatar(user.id, formData);
        
        if (error) {
          Alert.alert('Upload Failed', 'Failed to upload profile picture');
          console.error(error);
        } else if (data) {
          setProfile(data);
          Alert.alert('Success', 'Profile picture updated successfully');
        }
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert('Error', 'Failed to select or upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Update Failed', 'Failed to update profile information');
      } else {
        // Refresh profile data
        const { data } = await fetchUserProfile(user.id);
        if (data) {
          setProfile(data);
        }
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A5D1A" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {uploading ? (
            <ActivityIndicator size="large" color="#1A5D1A" style={styles.avatar} />
          ) : (
            <TouchableOpacity onPress={handleSelectImage}>
              {profile?.avatar_url ? (
                <Avatar.Image
                  size={120}
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={60} color="#7f8c8d" />
                </View>
              )}
              <View style={styles.avatarAccessory}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        <Text variant="headlineMedium" style={styles.nameText}>
          {profile?.first_name} {profile?.last_name}
        </Text>
        <Text variant="bodyLarge" style={styles.emailText}>{user?.email}</Text>
        
        <Button 
          mode="outlined"
          style={styles.editButton} 
          onPress={() => setEditing(!editing)}
          textColor="white"
          buttonColor="rgba(255, 255, 255, 0.2)"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </View>

      {editing ? (
        <Card style={styles.profileCard}>
          <Card.Title title="Edit Profile" />
          <Card.Content>
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              autoCapitalize="words"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              autoCapitalize="words"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              style={styles.input}
              mode="outlined"
            />
            
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              disabled={saving}
              loading={saving}
              style={styles.saveButton}
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.profileCard}>
          <Card.Title title="Profile Information" />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>First Name:</Text>
              <Text variant="bodyMedium" style={styles.infoValue}>{profile?.first_name || 'Not set'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>Last Name:</Text>
              <Text variant="bodyMedium" style={styles.infoValue}>{profile?.last_name || 'Not set'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>Email:</Text>
              <Text variant="bodyMedium" style={styles.infoValue}>{profile?.email || user?.email}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>Phone:</Text>
              <Text variant="bodyMedium" style={styles.infoValue}>{profile?.phone || 'Not set'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>Member Since:</Text>
              <Text variant="bodyMedium" style={styles.infoValue}>
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString() 
                  : 'Unknown'}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
      
      <Button
        mode="contained"
        onPress={signOut}
        style={styles.signOutButton}
        buttonColor="#ff6b6b"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#1A5D1A',
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'white',
  },
  avatarAccessory: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1A5D1A',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  nameText: {
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  emailText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    textAlign: 'center',
  },
  editButton: {
    borderColor: 'white',
  },
  profileCard: {
    borderRadius: 10,
    margin: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    flex: 1,
    fontWeight: 'bold',
    color: '#555',
  },
  infoValue: {
    flex: 2,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#1A5D1A',
    marginTop: 16,
  },
  signOutButton: {
    margin: 16,
    marginTop: 8,
  },
  avatarPlaceholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 