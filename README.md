# Clinyc User App

A React Native mobile application built with Expo and Supabase for managing legal cases and client communications.

## Project Status

The app is currently in development with the following features implemented:

- ✅ User Authentication (Sign Up, Login, Password Reset)
- ✅ Profile Management
- ✅ Case Management
- ✅ Document Upload and Management
- ✅ Real-time Chat System
- ✅ Offline Support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd clinyc-user-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the App

1. Start the development server:
```bash
npx expo start
```

2. Use Expo Go app on your mobile device or an emulator to run the application.

## Authentication

### Test Credentials

For development and testing, you can use the following credentials:

- **Email:** user@clinyc.com
- **Password:** ClinyC123!

### Creating New Users

If you need to create a new user, you can:

1. Use the app's registration screen
2. Use Supabase Dashboard
3. Use Postman with the following request:

```http
POST https://[your-supabase-url]/auth/v1/signup
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "YourPassword123!",
  "options": {
    "data": {
      "fullName": "Your Full Name"
    }
  }
}
```

## Database Schema

The app uses the following main tables:

1. **profiles** - User profiles
2. **cases** - Legal cases
3. **documents** - Case-related documents
4. **messages** - Chat messages

## Development

### Project Structure

```
/app                   # Expo Router navigation
/assets                # Images, fonts, and other static assets
/components            # Reusable UI components
/contexts              # React Context providers
/hooks                 # Custom React hooks
/screens               # Screen components
/services              # API services and external integrations
/utils                 # Utility functions
```

### Testing

Run the test suite:
```bash
npm test
```

## Deployment

### Building for Production

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure your build:
```bash
eas build:configure
```

3. Build for platforms:
```bash
eas build --platform android
eas build --platform ios
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For inquiries, please contact [your-email@example.com](mailto:your-email@example.com)

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution issues, try these solutions:

1. **Missing invariant module**:
   - Run `npm install invariant --save --legacy-peer-deps`
   - Run `npm run patch-modules` to patch the gesture handler
   - If issues persist, check the module paths in `babel.config.js` and `metro.config.js`

2. **React Navigation compatibility**:
   - Ensure you're using compatible versions as defined in `DEPENDENCIES.md`
   - Run `npm run update-deps` to fix common versioning issues

3. **Expo modules issues**:
   - Check that all shim files are properly configured
   - Verify that the module aliases in `babel.config.js` are correct

# Clinyc User App - RAG Implementation Guide

## Overview
This project implements a Retrieval Augmented Generation (RAG) system using LangChain to enhance the application's ability to provide accurate and contextually relevant responses.

## Prerequisites
- Python 3.8+
- pip (Python package manager)
- OpenAI API key
- Vector database (e.g., Chroma, Pinecone, or FAISS)

## Installation Steps

1. Install required dependencies:
```bash
pip install langchain
pip install openai
pip install chromadb  # or your preferred vector database
pip install python-dotenv
pip install tiktoken
```

2. Set up environment variables:
Create a `.env` file in your project root:
```
OPENAI_API_KEY=your_api_key_here
```

## Implementation Steps

### 1. Document Processing
- Create a document loader to process your input data
- Implement text splitting to chunk documents appropriately
- Set up document embeddings

### 2. Vector Store Setup
- Initialize your chosen vector database
- Create embeddings for your documents
- Store the embeddings in the vector database

### 3. Retrieval System
- Implement similarity search functionality
- Set up context retrieval based on user queries
- Configure retrieval parameters (e.g., number of relevant documents)

### 4. Generation System
- Set up the LLM (Language Model) integration
- Implement prompt templates
- Configure response generation with retrieved context

### 5. Integration
- Connect the retrieval and generation components
- Implement error handling and fallback mechanisms
- Set up logging and monitoring

## Example Implementation

```python
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# 1. Load and process documents
loader = TextLoader('your_document.txt')
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

# 2. Create embeddings and store in vector database
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(texts, embeddings)

# 3. Set up retrieval and generation
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# 4. Query the system
response = qa_chain.run("Your question here")
```

## Best Practices

1. **Document Processing**
   - Use appropriate chunk sizes based on your content
   - Implement metadata tracking for better context
   - Consider document preprocessing for better results

2. **Vector Store**
   - Regularly update your vector store with new information
   - Implement versioning for your embeddings
   - Monitor vector store performance

3. **Retrieval**
   - Fine-tune similarity search parameters
   - Implement hybrid search when needed
   - Consider implementing re-ranking for better results

4. **Generation**
   - Use appropriate prompt templates
   - Implement temperature controls
   - Add safety checks for generated content

## Monitoring and Maintenance

1. Set up logging for:
   - Query performance
   - Response quality
   - System errors
   - Usage metrics

2. Regular maintenance tasks:
   - Update document embeddings
   - Monitor API usage
   - Review and update prompts
   - Clean up vector store

## Next Steps

1. Implement the basic RAG pipeline
2. Test with sample documents
3. Fine-tune retrieval parameters
4. Add monitoring and logging
5. Deploy and test in production
6. Gather feedback and iterate

## Resources

- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Vector Database Options](https://python.langchain.com/docs/modules/data_connection/vectorstores)
- [RAG Best Practices](https://python.langchain.com/docs/use_cases/question_answering)

## Contributing

Feel free to contribute to this project by:
1. Reporting issues
2. Suggesting improvements
3. Submitting pull requests

## License

[Your chosen license] 