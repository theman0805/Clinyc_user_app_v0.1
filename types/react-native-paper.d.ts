declare module 'react-native-paper' {
  import { ComponentType } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  export interface TextInputProps {
    label?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    style?: ViewStyle;
    mode?: 'flat' | 'outlined';
    multiline?: boolean;
    numberOfLines?: number;
    disabled?: boolean;
  }

  export interface ModalProps {
    visible: boolean;
    onDismiss: () => void;
    contentContainerStyle?: ViewStyle;
    children?: React.ReactNode;
  }

  export const TextInput: ComponentType<TextInputProps>;
  export const Modal: ComponentType<ModalProps>;
  export const Text: ComponentType<any>;
  export const Button: ComponentType<any>;
  export const Card: ComponentType<any>;
  export const Portal: ComponentType<any>;
  export const PaperProvider: ComponentType<{ theme?: any; children: React.ReactNode }>;
  export const Avatar: ComponentType<any>;
  export const MD3LightTheme: any;
  export const MD3DarkTheme: any;
  export const ActivityIndicator: ComponentType<any>;
  export const FAB: ComponentType<any>;
  export const List: ComponentType<any>;
  export const Divider: ComponentType<any>;
  export const Chip: ComponentType<any>;
  export const IconButton: ComponentType<any>;
  export const ProgressBar: ComponentType<any>;
  export const Snackbar: ComponentType<any>;
} 