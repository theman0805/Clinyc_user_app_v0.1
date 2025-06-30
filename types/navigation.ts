// Navigation parameter types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Cases: undefined;
  Upload: undefined;
  Chats: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Chat: {
    receiverId: string;
    receiverName: string;
    caseId?: string;
  };
};

// Navigation hook types
export interface NavigationProps {
  navigation: any;
  route: any;
}