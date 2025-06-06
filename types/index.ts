// User related types
export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

// Auth related types
export type AuthError = {
  message: string;
  status?: number;
};

// Healthcare related types
export type MedicalCase = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'active' | 'resolved' | 'archived';
  created_at: string;
  updated_at: string;
  documents?: Document[];
};

export type Document = {
  id: string;
  user_id: string;
  case_id: string;
  name: string;
  description?: string;
  file_path: string;
  file_type: string;
  size: number;
  created_at: string;
  updated_at: string;
};

// Doctor related types
export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar_url?: string;
  hospital?: string;
  bio?: string;
};

// Chat related types
export type Message = {
  id: string;
  text: string;
  sender_id: string;
  sender_type: 'user' | 'doctor' | 'system';
  created_at: string;
  read: boolean;
  conversation_id: string;
  attachments?: Attachment[];
};

export type Conversation = {
  id: string;
  title: string;
  participants: string[];
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
};

export type Attachment = {
  id: string;
  file_path: string;
  file_type: string;
  file_name: string;
  size: number;
  message_id: string;
}; 