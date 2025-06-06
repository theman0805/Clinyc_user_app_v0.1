const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * This script helps update dependencies while maintaining compatibility
 * It installs compatible versions of packages that work together
 */

// Define compatibility groups - packages that need specific version combinations
const COMPATIBILITY_GROUPS = {
  // @rneui needs react-native-safe-area-context@4.x
  '@rneui/base': {
    'react-native-safe-area-context': '^4.0.0'
  },
  // React Navigation v6 compatibility
  '@react-navigation/native': {
    '@react-navigation/bottom-tabs': '^6.6.1',
    '@react-navigation/native-stack': '^6.11.0'
  }
};

function updateDependenciesWithCompatibility() {
  console.log('⏳ Updating dependencies with compatibility in mind...');
  
  try {
    // Use --legacy-peer-deps to handle peer dependency conflicts
    console.log('🔄 Updating all dependencies safely...');
    execSync('npm update --legacy-peer-deps', { stdio: 'inherit' });
    
    // Install specific versions for compatibility
    console.log('🔄 Installing compatible versions of @rneui and safe-area-context...');
    execSync('npm install react-native-safe-area-context@4.0.0 --legacy-peer-deps', { stdio: 'inherit' });
    
    console.log('🔄 Installing compatible versions of React Navigation packages...');
    execSync('npm install @react-navigation/bottom-tabs@6.6.1 @react-navigation/native@6.1.18 @react-navigation/native-stack@6.11.0 --legacy-peer-deps', { stdio: 'inherit' });
    
    console.log('✅ Dependencies updated successfully while maintaining compatibility!');
    console.log('\n📋 Run npm outdated to see what packages can be further updated manually.');
  } catch (error) {
    console.error('❌ Error updating dependencies:', error.message);
    process.exit(1);
  }
}

updateDependenciesWithCompatibility(); 