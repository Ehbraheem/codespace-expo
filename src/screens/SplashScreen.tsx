import Box from '@/components/Box';
import React from 'react';
import { Image } from 'react-native';

const SplashScreen = () => {
  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="primary">
      <Image source={require('../assets/images/logo.png')} />
    </Box>
  );
};

export default SplashScreen;
