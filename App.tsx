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
import React, { useEffect, useRef } from 'react';
import { LogBox, Platform, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import MainStack from '@/navigators/MainStack';

LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

const RootNav = () => {
  const navigationRef = useRef(null);

  const themex = useTheme();
  const { background, primary } = themex.colors;

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: background,
        },
      }}
      ref={navigationRef}>
      {/* <StatusBar barStyle={'light-content'} backgroundColor={'#1B284A'} /> */}
      <MainStack />
      <Toast />
      <StatusBar
        backgroundColor={primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
    </NavigationContainer>
  );
};

const ThemeHandler = () => {
  // const { darkMode } = useSettings();
  const darkMode = false;

  return (
    <ThemeProvider theme={darkMode ? theme : darkTheme}>
      <RootNav />
    </ThemeProvider>
  );
};

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <ThemeHandler />
    </Provider>
  );
};

export default App;
