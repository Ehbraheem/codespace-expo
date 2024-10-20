import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Box from './Box';
import Text from './Text';
import { useUser } from '@/state/hooks/user.hook';
// import { resetUser } from '../redux/user/user.slice';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { user } = useUser();

  return (
    <DrawerContentScrollView {...props}>
      <Box
        borderBottomWidth={5}
        borderBottomColor="white"
        paddingHorizontal="l"
        paddingVertical="pad"
        flexDirection="row"
        alignItems="flex-start">
        <Box position="relative">
          <Box
            height={40}
            width={40}
            borderRadius={40}
            style={{ backgroundColor: '#2D4779' }}></Box>
          <Box
            borderWidth={1.5}
            borderColor="white"
            position="absolute"
            height={10}
            borderRadius={10}
            width={10}
            bottom={0}
            right={0}
            style={{
              backgroundColor: '#12B76A',
            }}></Box>
        </Box>
        <Box marginLeft="m">
          <Text variant="medium" color="white">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text variant="regular" fontSize={12} color="white">
            Super Admin
          </Text>
        </Box>
      </Box>
      <Box paddingHorizontal="m">
        <DrawerItemList {...props} />
      </Box>
      {/* <DrawerItem
        icon={() => (
          <FontAwesome name="power-off" color={lightPrimary} size={14} />
        )}
        label="Logout"
        onPress={() => dispatch(resetUser())}
        activeBackgroundColor={addAlpha('#ffffff', 0.2)}
        activeTintColor={'#fff'}
        inactiveBackgroundColor={primary}
        inactiveTintColor={addAlpha('#ffffff', 0.8)}
        labelStyle={{
          fontFamily: 'Poppins-Regular',
          marginLeft: 0,
          paddingLeft: 0,
        }}
        style={{
          backgroundColor: primary,
          paddingHorizontal: m,
          marginLeft: -17,
        }}
      /> */}
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
