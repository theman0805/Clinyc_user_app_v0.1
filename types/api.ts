// Base API types
export interface ApiResponse<T = any> {
  data: T | null;
  error: any | null;
}

// Profile type (for database)
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

// Case types
export interface Case {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'active' | 'resolved' | 'archived';
  created_at: string;
  updated_at: string;
  documents?: Document[];
}

// Document types
export interface Document {
  id: string;
  user_id: string;
  case_id: string;
  name: string;
  description?: string;
  storage_path: string;
  file_type: string;
  size: number;
  processed?: boolean;
  text_extracted?: boolean;
  created_at: string;
  updated_at: string;
}

// File upload types
export interface FileData {
  name: string;
  mimeType: string;
  size: number;
  uri: string;
}

export interface UploadResult {
  path: string | null;
  data: any;
  error: any | null;
  publicUrl?: string;
}

// Message types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  case_id?: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  participants: string[];
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

// Sharing types
export interface SharingLog {
  case_id: string;
  recipient_id: string;
  share_type: 'document_list' | 'structured_data';
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}