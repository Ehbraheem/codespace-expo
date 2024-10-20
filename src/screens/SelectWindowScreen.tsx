import Box from '@/components/Box';
import Button from '@/components/Button';
import Dropdown from '@/components/DropDown';
import Text from '@/components/Text';
import { MainStack } from '@/utils/ParamList';
import { Theme } from '@/utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Image, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';

interface Props {
  navigation: NativeStackNavigationProp<MainStack, 'SelectWindow'>;
}

const SelectWindowScreen = ({ navigation }: Props) => {
  const [window, setWindow] = useState('');
  const theme = useTheme<Theme>();
  const { primary } = theme.colors;

  const proceed = () => {
    if (!window) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Select an option to proceed',
      });
    }
    if (window === 'FMS') {
      navigation.navigate('Tab', {
        screen: 'Home',
      });
      return;
    }

    if (window === 'Security') {
      navigation.navigate('QRScan');
      return;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: primary,
      }}>
      <Box flex={1} backgroundColor="background">
        <Box
          height={194}
          backgroundColor="primary"
          justifyContent="center"
          alignItems="center"
          borderBottomLeftRadius={15}
          borderBottomRightRadius={15}>
          <Image source={require('@/assets/images/logo.png')} />
        </Box>
        <Box
          flex={1}
          paddingHorizontal="pad"
          paddingTop="xl"
          justifyContent="space-between">
          <Box>
            <Text
              variant="medium"
              fontSize={20}
              color="primary"
              marginBottom="s">
              Select window to continue
            </Text>
            <Dropdown
              // color={foreground}
              displayText="Select Window"
              onSelect={v => {
                setWindow(v);
              }}
              selectorContainerProps={{
                paddingVertical: 'm',
              }}
              data={[
                // {
                //   title: 'FMS',
                //   value: 'FMS',
                // },
                {
                  title: 'Security',
                  value: 'Security',
                },
              ]}
              style={{
                marginTop: 0,
              }}
            />
          </Box>
          <Box marginBottom="xxl">
            <Button displayText="Continue" onPress={() => proceed()} />
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default SelectWindowScreen;
