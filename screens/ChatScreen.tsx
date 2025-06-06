import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import { useRoute } from '@react-navigation/native';
import { fetchMessages, sendMessage, markMessagesAsRead, subscribeToMessages, Message } from '../services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// Chat bubble component
const ChatBubble = ({ message, isOwnMessage }: { message: Message; isOwnMessage: boolean }) => {
  return (
    <View
      style={[
        styles.messageBubble,
        isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
      ]}
    >
      <Text style={[styles.messageText, isOwnMessage ? styles.ownMessageText : styles.otherMessageText]}>
        {message.content}
      </Text>
      <Text style={[styles.messageTime, isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime]}>
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

export default function ChatScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const flatListRef = useRef<FlatList>(null);
  
  // Get receiver ID and case ID from route params if available
  const { receiverId, caseId, receiverName } = route.params as { 
    receiverId: string;
    caseId?: string;
    receiverName: string;
  };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  // Load previous messages from the conversation
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        
        // Fetch messages from Supabase
        const { data, error } = await fetchMessages(user.id, receiverId, caseId);
        
        if (error) {
          console.error('Error fetching messages:', error);
          Alert.alert('Error', 'Failed to load messages');
        } else if (data) {
          setMessages(data as Message[]);
          
          // Mark received messages as read
          await markMessagesAsRead(user.id, receiverId);
        }
      } catch (error) {
        console.error('Unexpected error loading messages:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
    
    // Set up realtime subscription
    const messageSubscription = subscribeToMessages((newMessage) => {
      // Only add message if it's relevant to this conversation
      const isRelevantMessage = (
        (newMessage.sender_id === user.id && newMessage.receiver_id === receiverId) ||
        (newMessage.sender_id === receiverId && newMessage.receiver_id === user.id)
      );
      
      // If case ID is specified, also check that
      if (caseId && isRelevantMessage) {
        isRelevantMessage && newMessage.case_id === caseId;
      }
      
      if (isRelevantMessage) {
        // Add new message to state
        setMessages(prev => [...prev, newMessage]);
        
        // If the message is from the other user, mark it as read
        if (newMessage.sender_id === receiverId) {
          markMessagesAsRead(user.id, receiverId);
        }
      }
    });
    
    setSubscription(messageSubscription);
    
    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user, receiverId, caseId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;
    
    const messageContent = inputMessage.trim();
    setInputMessage('');
    setSending(true);
    
    try {
      // Send message to Supabase
      const { data, error } = await sendMessage(
        user.id,
        receiverId,
        messageContent,
        caseId
      );
      
      if (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message');
        // Restore the input if sending failed
        setInputMessage(messageContent);
      } else {
        // No need to add to messages here, as it will come through the realtime subscription
        // But we can add it optimistically if needed
        if (!data) {
          // If no data returned, add an optimistic message
          const tempMessage: Message = {
            id: Date.now().toString(), // Temporary ID
            sender_id: user.id,
            receiver_id: receiverId,
            case_id: caseId,
            content: messageContent,
            created_at: new Date().toISOString(),
            is_read: false,
          };
          setMessages(prev => [...prev, tempMessage]);
        }
      }
    } catch (error) {
      console.error('Unexpected error sending message:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      setInputMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  // Render message item
  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender_id === user?.id;
    return <ChatBubble message={item} isOwnMessage={isOwnMessage} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{receiverName || 'Chat'}</Text>
        {caseId && <Text style={styles.headerSubtitle}>Case Discussion</Text>}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A5D1A" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => 
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyMessagesContainer}>
                <Ionicons name="chatbubbles-outline" size={60} color="#ddd" />
                <Text style={styles.emptyMessagesText}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            )}
          />
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
              maxLength={500}
              autoCapitalize="sentences"
              editable={!sending}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputMessage.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
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
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  ownMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1A5D1A',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  ownMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherMessageTime: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A5D1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#aaa',
  },
  emptyMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyMessagesText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
}); 