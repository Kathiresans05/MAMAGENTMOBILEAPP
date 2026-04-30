import React from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0F4C81',
    secondary: '#F4B400',
  },
};

const App = () => {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;
