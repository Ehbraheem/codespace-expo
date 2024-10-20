/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { store } from '@/state/store';
import theme, { darkTheme } from '@/utils/theme';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from '@shopify/restyle';
import React from 'react';
import { LogBox, Platform, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import MainStack from '@/app/(tabs)/_layout';

LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

const App = () => {
  const themex = useTheme();
  const { background, primary } = themex.colors;

  return (
    <Provider store={store}>
      <ThemeProvider theme={false ? theme : darkTheme}>
        <NavigationContainer
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: background,
            },
          }}
          independent={true} // Mark this NavigationContainer as independent
          >
          <MainStack />
          <Toast />
          <StatusBar
            backgroundColor={primary}
            barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
          />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
