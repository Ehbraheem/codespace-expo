import Box from '@/components/Box';
import SignInScreen from '@/app/(auth)/SignInScreen';
import ShipmentsScreen from '@/app/(main)/ShipmentsScreen';
import SelectWindowScreen from '@/app/(main)/SelectWindowScreen';
// import SplashScreen from '@/screens/SplashScreen';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { addAlpha } from '@/utils/helpers';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/utils/theme';
import { useNavigation } from '@react-navigation/native';
import OrderReportScreen from '@/app/(main)/OrderReportScreen';
// import BottomTab from './BottomTab';
import { MainStack as MainStackType } from '@/utils/ParamList';
import { useUser } from '@/state/hooks/user.hook';
import SecurityScanScreen from '@/app/(main)/SecurityScanScreen';
import QRScanScreen from '@/app/(main)/QRScanScreen';
import StoredDataScreen from '@/app/(main)/storedData';

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
          <Stack.Screen
            name="StoredDataScreen"
            component={StoredDataScreen}
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
