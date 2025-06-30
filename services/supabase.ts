import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase credentials from Constants (app.config.js)
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is not defined. Make sure your .env file is set up correctly.');
}

console.log('Initializing Supabase with URL:', supabaseUrl);

// Create a custom storage implementation for Supabase with AsyncStorage
const supabaseStorage = {
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export types for use throughout the app
export type { User, Session } from '@supabase/supabase-js';
import type { 
  Profile, 
  Case, 
  Document, 
  Message, 
  ApiResponse, 
  FileData, 
  UploadResult 
} from '../types/api';

// Fetch user profile data
export const fetchUserProfile = async (userId: string): Promise<ApiResponse<Profile>> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data: data as Profile | null, error };
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<ApiResponse<Profile>> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();

  return { data: data as Profile | null, error };
};

// Upload profile avatar
export const uploadAvatar = async (userId: string, file: any) => {
  // Generate a unique file name
  const fileName = `avatar-${userId}-${Date.now()}`;
  
  // Upload file to Supabase Storage
  const { data, error } = await supabase
    .storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return { data: null, error };
  }

  // Get public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Update user profile with avatar URL
  const avatarUrl = publicUrlData.publicUrl;
  return updateUserProfile(userId, { avatar_url: avatarUrl });
};

// Fetch cases for a user
export const fetchUserCases = async (userId: string) => {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Create a new case
export const createCase = async (
  userId: string,
  title: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from('cases')
    .insert([
      { user_id: userId, title, description, status: 'active' },
    ])
    .select('*')
    .single();

  return { data, error };
};

// Fetch documents for a case
export async function fetchCaseDocuments(caseId: string) {
  return supabase
    .from('documents')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });
}

// Save document metadata
export async function saveDocumentMetadata(
  userId: string,
  caseId: string,
  name: string,
  storagePath: string,
  fileType: string,
  fileSize: number,
  description?: string
) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          user_id: userId,
          case_id: caseId,
          name,
          description,
          storage_path: storagePath,
          file_type: fileType,
          size: fileSize,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Metadata save error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Document metadata error:', error);
    return { data: null, error };
  }
}

// Upload a document
export async function uploadDocument(userId: string, fileUri: string, fileData: any) {
  try {
    // Generate a unique file name with timestamp
    const timestamp = Date.now();
    const fileName = fileData.name || `document-${timestamp}`;
    // Sanitize the filename to remove special characters
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileExtension = sanitizedFileName.split('.').pop() || 'pdf';
    const path = `${userId}/${timestamp}-${sanitizedFileName}`;

    // Convert file to blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-files')
      .upload(path, blob, {
        contentType: fileData.mimeType || 'application/octet-stream',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { path: null, data: null, error };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('user-files')
      .getPublicUrl(path);

    return { 
      path, 
      data, 
      error: null,
      publicUrl: urlData.publicUrl 
    };
  } catch (error) {
    console.error('Document upload error:', error);
    return { path: null, data: null, error };
  }
}

// Share a case
export async function shareCase(caseId: string, recipientId: string, shareType: 'document_list' | 'structured_data') {
  // This would call a Supabase Function in production
  // For MVP, we'll just log the sharing activity
  return supabase
    .from('sharing_log')
    .insert([{ 
      case_id: caseId, 
      recipient_id: recipientId, 
      share_type: shareType 
    }]);
}

// Send a message
export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
  caseId?: string
): Promise<ApiResponse<Message>> {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        case_id: caseId,
        content,
        is_read: false,
        created_at: new Date().toISOString(),
      }
    ])
    .select('*')
    .single();

  return { data, error };
}

// Fetch messages for a conversation
export async function fetchMessages(
  userId: string,
  otherUserId: string,
  caseId?: string
) {
  let query = supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
    .order('created_at', { ascending: true });
  
  // If case ID is provided, filter by it
  if (caseId) {
    query = query.eq('case_id', caseId);
  }
  
  return query;
}

// Mark messages as read
export async function markMessagesAsRead(
  userId: string,
  senderId: string
) {
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', userId)
    .eq('sender_id', senderId)
    .eq('is_read', false);
  
  return { data, error };
}

// Subscribe to new messages in a conversation
export function subscribeToMessages(
  callback: (message: Message) => void
) {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      (payload) => {
        // Call the callback with the new message
        callback(payload.new as Message);
      }
    )
    .subscribe();
}

// Fetch all conversations for a user
export async function fetchConversations(userId: string) {
  // This query is more complex and may need to be optimized based on database structure
  // It gets the last message for each unique conversation (userId + otherUserId combination)
  const { data, error } = await supabase.rpc('get_conversations', { user_id: userId });
  
  return { data, error };
}

// Re-export types for backward compatibility
export type { Profile, Case, Document, Message } from '../types/api'; 