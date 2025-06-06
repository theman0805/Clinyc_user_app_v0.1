import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { fetchConversations, subscribeToMessages, Message } from '../services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// Chat conversation type
interface ChatConversation {
  id: string;
  receiver_id: string;
  receiver_name: string;
  avatar_url: string | null;
  last_message: string;
  unread_count: number;
  last_message_time: string;
  case_id?: string;
  case_title?: string;
}

// Chat list item component
const ChatListItem = ({ conversation, onPress }: { 
  conversation: ChatConversation; 
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <View style={styles.avatarContainer}>
        {conversation.avatar_url ? (
          <Image source={{ uri: conversation.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.avatarText}>
              {conversation.receiver_name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>
            {conversation.receiver_name}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(conversation.last_message_time)}
          </Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {conversation.case_title ? `[${conversation.case_title}] ` : ''}
            {conversation.last_message}
          </Text>
          
          {conversation.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Helper function to format timestamp
const formatTimestamp = (timestamp: string) => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  
  if (now.toDateString() === messageDate.toDateString()) {
    // Today, show time
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (now.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
    // Less than a week ago, show day name
    return messageDate.toLocaleDateString([], { weekday: 'short' });
  } else {
    // Older, show date
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export default function ChatsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  // Load conversations
  useEffect(() => {
    if (!user) return;
    
    const loadConversations = async () => {
      try {
        setLoading(true);
        
        // Fetch conversations from Supabase
        const { data, error } = await fetchConversations(user.id);
        
        if (error) {
          console.error('Error fetching conversations:', error);
          Alert.alert('Error', 'Failed to load conversations');
        } else if (data) {
          // Transform the data to match our ChatConversation type
          const formattedConversations = data.map((item: any) => ({
            id: item.conversation_id || String(item.id),
            receiver_id: item.other_user_id,
            receiver_name: `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Unknown User',
            avatar_url: item.avatar_url,
            last_message: item.content || 'No messages yet',
            unread_count: item.unread_count || 0,
            last_message_time: item.created_at || new Date().toISOString(),
            case_id: item.case_id,
            case_title: item.case_title,
          }));
          
          setConversations(formattedConversations);
        }
      } catch (error) {
        console.error('Unexpected error loading conversations:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
    
    // Set up realtime subscription to update conversations when new messages arrive
    const messageSubscription = subscribeToMessages((newMessage: Message) => {
      if (newMessage.sender_id === user.id || newMessage.receiver_id === user.id) {
        // Reload conversations when a new message is received
        loadConversations();
      }
    });
    
    setSubscription(messageSubscription);
    
    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user]);

  // Navigate to chat screen
  const handleChatPress = (conversation: ChatConversation) => {
    // @ts-ignore - Navigation typing will be handled in full implementation
    navigation.navigate('Chat', {
      receiverId: conversation.receiver_id,
      receiverName: conversation.receiver_name,
      caseId: conversation.case_id,
    });
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={70} color="#ccc" />
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptySubtitle}>
        When you start chatting with healthcare providers, they'll appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A5D1A" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={({ item }) => (
            <ChatListItem 
              conversation={item} 
              onPress={() => handleChatPress(item)} 
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            conversations.length === 0 ? { flex: 1 } : styles.list
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1A5D1A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  list: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A5D1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '70%',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    maxWidth: '85%',
  },
  unreadBadge: {
    backgroundColor: '#1A5D1A',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
}); 