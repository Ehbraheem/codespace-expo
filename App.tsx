/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import theme, { darkTheme } from '@/utils/theme';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from '@shopify/restyle';
import { useCallback, useEffect, useRef } from 'react';
import { LogBox, Platform, StatusBar, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // We'll make network calls here
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      onLayout={onLayoutRootView}>
      <ThemeHandler />
    </View>
  );
};

export default App;
