import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    step: 'Email' | 'Token' | 'Password' | 'Success' | 'Error';
    email: string;
    token: string;
    password: string;
  }
}
