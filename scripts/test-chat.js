// Chat testing script for Clinyc app
// This script simulates conversations between two users to test the chat functionality

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase connection details
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://dgbauvfjeceazjnngire.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Add your service key to .env file

// User IDs from the database
const USER1_ID = '83d9a45d-e9e2-4a64-a759-0b535f4e34bc'; // muthu.manikandan.m@gmail.com
const USER2_ID = '71631d23-dff8-47a9-b7fb-ecd3e63e9777'; // user@clinyc.com

// Initialize Supabase admin client with service key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Function to update user profiles with test data
async function updateUserProfiles() {
  console.log('Updating user profiles...');
  
  const { data: user1Update, error: user1Error } = await supabaseAdmin
    .from('profiles')
    .update({
      first_name: 'Muthu',
      last_name: 'Manikandan',
    })
    .eq('id', USER1_ID);
  
  if (user1Error) {
    console.error('Error updating user 1 profile:', user1Error);
  } else {
    console.log('User 1 profile updated');
  }
  
  const { data: user2Update, error: user2Error } = await supabaseAdmin
    .from('profiles')
    .update({
      first_name: 'Test',
      last_name: 'User',
    })
    .eq('id', USER2_ID);
  
  if (user2Error) {
    console.error('Error updating user 2 profile:', user2Error);
  } else {
    console.log('User 2 profile updated');
  }
}

// Function to send a message
async function sendMessage(senderId, receiverId, content, caseId = null) {
  const { data, error } = await supabaseAdmin
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
    .select('*');
  
  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  
  console.log(`Message sent from ${senderId} to ${receiverId}: ${content}`);
  return data[0];
}

// Function to simulate a conversation
async function simulateConversation() {
  console.log('\n=== Starting conversation simulation ===\n');
  
  // User 1 starts the conversation
  await sendMessage(USER1_ID, USER2_ID, 'Hello, I need some information about my recent appointment.');
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  // User 2 responds
  await sendMessage(USER2_ID, USER1_ID, 'Hi! I can help you with that. Which appointment are you referring to?');
  await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5 seconds
  
  // User 1 provides details
  await sendMessage(USER1_ID, USER2_ID, 'The cardiology appointment from last Tuesday with Dr. Johnson.');
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  
  // User 2 responds with more information
  await sendMessage(USER2_ID, USER1_ID, 'I see that appointment in your records. What specific information do you need?');
  await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5 seconds
  
  // User 1 asks a question
  await sendMessage(USER1_ID, USER2_ID, 'I need to know if my test results are available yet.');
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  
  // User 2 provides information
  await sendMessage(USER2_ID, USER1_ID, 'Yes, your test results were uploaded yesterday. You can view them in the Documents section under "Cardiology Tests".');
  
  console.log('\n=== Conversation simulation completed ===\n');
}

// Function to test realtime subscription
async function testRealtimeSubscription() {
  console.log('\n=== Testing realtime subscription ===\n');
  
  // Subscribe to messages
  const subscription = supabaseAdmin
    .channel('messages_channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      (payload) => {
        console.log('Realtime message received:', payload.new);
      }
    )
    .subscribe();
  
  console.log('Subscribed to realtime updates. Sending test message...');
  
  // Send a test message
  await sendMessage(USER1_ID, USER2_ID, 'This is a test message for realtime updates');
  
  // Wait 3 seconds to receive the realtime message
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Unsubscribe
  subscription.unsubscribe();
  console.log('Unsubscribed from realtime updates');
}

// Function to check message counts
async function checkMessageCounts() {
  console.log('\n=== Checking message counts ===\n');
  
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('sender_id, receiver_id')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching messages:', error);
    return;
  }
  
  // Count messages by sender/receiver
  const counts = {
    [`${USER1_ID} → ${USER2_ID}`]: 0,
    [`${USER2_ID} → ${USER1_ID}`]: 0,
  };
  
  data.forEach(msg => {
    const key = `${msg.sender_id} → ${msg.receiver_id}`;
    if (counts[key] !== undefined) {
      counts[key]++;
    }
  });
  
  console.log('Message counts:');
  console.log(`User 1 → User 2: ${counts[`${USER1_ID} → ${USER2_ID}`]} messages`);
  console.log(`User 2 → User 1: ${counts[`${USER2_ID} → ${USER1_ID}`]} messages`);
  console.log(`Total: ${data.length} messages`);
}

// Function to test the get_conversations function
async function testGetConversations() {
  console.log('\n=== Testing get_conversations function ===\n');
  
  // Test for user 1
  const { data: user1Conversations, error: user1Error } = await supabaseAdmin.rpc(
    'get_conversations',
    { user_id: USER1_ID }
  );
  
  if (user1Error) {
    console.error('Error getting conversations for User 1:', user1Error);
  } else {
    console.log('User 1 conversations:');
    console.log(user1Conversations);
  }
  
  // Test for user 2
  const { data: user2Conversations, error: user2Error } = await supabaseAdmin.rpc(
    'get_conversations',
    { user_id: USER2_ID }
  );
  
  if (user2Error) {
    console.error('Error getting conversations for User 2:', user2Error);
  } else {
    console.log('User 2 conversations:');
    console.log(user2Conversations);
  }
}

// Run all tests
async function runTests() {
  console.log('Starting chat functionality tests...');
  
  try {
    // Update user profiles
    await updateUserProfiles();
    
    // Simulate a conversation
    await simulateConversation();
    
    // Test realtime subscription
    await testRealtimeSubscription();
    
    // Check message counts
    await checkMessageCounts();
    
    // Test get_conversations function
    await testGetConversations();
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Only run if executed directly
if (require.main === module) {
  if (!supabaseServiceKey) {
    console.error('Error: SUPABASE_SERVICE_KEY environment variable not set');
    console.error('Please create a .env file with your Supabase service key');
    process.exit(1);
  }
  
  runTests()
    .then(() => {
      console.log('Tests execution finished');
      process.exit(0);
    })
    .catch(err => {
      console.error('Unhandled error during tests:', err);
      process.exit(1);
    });
} 