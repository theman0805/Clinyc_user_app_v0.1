# Chat Testing Scripts

This directory contains scripts for testing the Clinyc app features.

## test-chat.js

This script tests the chat functionality between two existing users in the application.

### Features

- Updates user profiles with test data
- Sends test messages between users
- Simulates a realistic conversation
- Tests real-time messaging subscriptions
- Verifies message counts in the database
- Tests the `get_conversations` function

### Prerequisites

- Node.js installed
- Supabase service key (admin API key)

### Setup

1. Create a `.env` file in the root directory with the following content:

```
EXPO_PUBLIC_SUPABASE_URL=https://dgbauvfjeceazjnngire.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
```

2. Install the required dependencies:

```bash
npm install dotenv @supabase/supabase-js
```

### Usage

Run the script from the project root:

```bash
node scripts/test-chat.js
```

The script will:
1. Update the profiles of both test users
2. Simulate a conversation with several messages
3. Test real-time subscription functionality
4. Report message counts in the database
5. Test the conversation retrieval functionality

### Important Notes

- The script uses hard-coded user IDs from the test database
- You must use a service key (not anon key) to run the script
- Never commit your service key to version control
- The script will create multiple test messages in your database 