import Box from '@/components/Box';
import SignInScreen from '@/screens/Auth/SignInScreen';
import ShipmentsScreen from '@/screens/Main/ShipmentsScreen';
import SelectWindowScreen from '@/screens/SelectWindowScreen';
// import SplashScreen from '@/screens/SplashScreen';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { addAlpha } from '@/utils/helpers';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/utils/theme';
import { useNavigation } from '@react-navigation/native';
import OrderReportScreen from '@/screens/Main/OrderReportScreen';
// import BottomTab from './BottomTab';
import { MainStack as MainStackType } from '@/utils/ParamList';
import { useUser } from '@/state/hooks/user.hook';
import SecurityScanScreen from '@/screens/SecurityScanScreen';
import QRScanScreen from '@/screens/QRScanScreen';

const Stack = createNativeStackNavigator<MainStackType>();

const MainStack = () => {
  const theme = useTheme<Theme>();
  const { primary, white } = theme.colors;
  const mainNavigation =
    useNavigation<NativeStackNavigationProp<MainStackType, any>>();
  const { user } = useUser();

  // const state = mainNavigation.getState();

  // useEffect(() => {
  //   if (
  //     state.routes[0].state?.routes[state.routes[0].state?.index || 0].name ===
  //     'Tab'
  //   ) {
  //     navigation.setOptions({
  //       headerShown: true,
  //     });
  //   } else {
  //     navigation.setOptions({
  //       headerShown: false,
  //     });
  //   }
  // }, [state, navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={mainNavigation.goBack}>
            <Box
              height={24}
              width={24}
              borderRadius={24}
              justifyContent="center"
              alignItems="center"
              style={{
                backgroundColor: addAlpha('#FFFFFF', 0.2),
              }}>
              <Feather name="arrow-left" size={14} color="#fff" />
            </Box>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: primary,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: white,
          fontFamily: 'BRFirma-Medium',
          fontSize: 18,
        },
      }}>
      {/* {splash && (
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
      )} */}
      {user === null ? (
        <Stack.Group>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="SelectWindow"
            component={SelectWindowScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SecurityScan"
            component={SecurityScanScreen}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="QRScan"
            component={QRScanScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="Tab"
            component={BottomTab}
            options={{
              headerShown: false,
            }}
          /> */}
          <Stack.Screen
            name="Shipments"
            component={ShipmentsScreen}
            options={{
              title: 'Shipments',
            }}
          />
          <Stack.Screen
            name="OrderReport"
            component={OrderReportScreen}
            options={{
              title: 'Order Report',
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
