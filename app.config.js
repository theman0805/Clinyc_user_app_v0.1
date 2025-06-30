import 'dotenv/config';

export default {
  name: "Clinyc",
  slug: "clinyc",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  plugins: [
    "expo-secure-store",
    ["expo-camera", {
      "cameraPermission": "Clinyc needs access to your camera to capture medical documents and images."
    }],
    "expo-document-picker",
    "expo-file-system",
    "expo-image-picker"
  ],
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription: "Clinyc needs access to your camera to capture medical documents and images.",
      NSPhotoLibraryUsageDescription: "Clinyc needs access to your photos to upload existing medical documents and images.",
      NSMicrophoneUsageDescription: "Clinyc needs access to your microphone."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  extra: {
    eas: {
      projectId: "your-eas-project-id"
    },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY
  }
}; 