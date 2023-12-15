import Box from '@/components/Box';
import Button from '@/components/Button';
import { MainStack } from '@/utils/ParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import QRCodeScanner from 'react-native-qrcode-scanner';

interface Props {
  navigation: NativeStackNavigationProp<MainStack, 'QRScan'>;
}

const QRScanScreen = ({ navigation }: Props) => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.replace('SecurityScan', {});
  //   }, 2000);
  // }, [navigation]);

  const [scan, setScan] = useState(false);

  const requestPermissions = async () => {
    try {
      const fineLocationCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const coarseLocationCheck = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
      if (!fineLocationCheck || !coarseLocationCheck) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
      }
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_COARSE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Required permissions denied',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {scan ? (
        <QRCodeScanner
          onRead={e => {
            setScan(false);
            navigation.replace('SecurityScan', {
              qrdata: e.data,
            });
          }}
          reactivate={false}
          showMarker={true}
          containerStyle={{ flex: 1 }}
          cameraStyle={{ flex: 1 }}
          bottomContent={
            <Box paddingHorizontal="l" width="100%" justifyContent="center">
              <Box marginBottom="l">
                <Button
                  onPress={() => setScan(false)}
                  displayText="Cancel Scan"
                />
              </Box>
            </Box>
          }
        />
      ) : (
        <Box paddingHorizontal="l" flex={1} justifyContent="center">
          <Box marginBottom="l">
            <Button onPress={() => setScan(true)} displayText="Scan" />
          </Box>
          <Box marginBottom="l">
            <Button
              onPress={() => navigation.navigate('CreateNewUser')}
              displayText="Register User"
            />
          </Box>
        </Box>
      )}
    </View>
  );
};

export default QRScanScreen;
