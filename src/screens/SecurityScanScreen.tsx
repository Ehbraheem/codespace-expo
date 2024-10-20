import Box from '@/components/Box';
// import Button from '@/components/Button';
import Loader from '@/components/Loader';
// import Input from '@/components/Input';
import OTPReasonModal from '@/components/OTPReasonModal';
import OTPSecurityModal from '@/components/OTPSecurityModal';
import Text from '@/components/Text';
import { MainStack } from '@/utils/ParamList';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { useRunMutation } from '@/state/services/utils.service';
import Geolocation from '@react-native-community/geolocation';
import { logBaseUrl } from '@/utils/helpers';
// import { useTheme } from '@shopify/restyle';
// import { Theme } from '@/utils/theme';
import { useSettings } from '@/state/hooks/settings.hook';
import { useDispatch } from 'react-redux';
import { addLog } from '@/state/reducers/logs.reducer';
import { Users } from '@/utils/types';
import { useUsers } from '@/state/hooks/users.hook';

interface Props {
  navigation: NativeStackNavigationProp<MainStack, 'SecurityScan'>;
  route: RouteProp<MainStack, 'SecurityScan'>;
}

const SecurityScanScreen = ({ route, navigation }: Props) => {
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [reason, setReason] = useState(false);
  const [localUser, setLocalUser] = useState<Users | undefined>(undefined);
  const [run, { isLoading: runLoading, error: runError, data: runData }] =
    useRunMutation();
  // const theme = useTheme<Theme>();
  // const { success, danger } = theme.colors;
  const { offlineStatus } = useSettings();
  const { users } = useUsers();
  const dispatch = useDispatch();
  const selectedUser = useMemo(
    () => localUser || (runData as typeof localUser),
    [localUser, runData],
  );

  useEffect(() => {
    if (!route.params?.qrdata) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid QR Code',
      });
      navigation.pop();
    } else {
      Geolocation.getCurrentPosition(
        info => {
          if (!offlineStatus) {
            run({
              url: `${logBaseUrl}/api/staff/barcode`,
              method: 'GET',
              params: {
                id: route.params?.qrdata,
                Latitude: info.coords.latitude,
                Longitude: info.coords.longitude,
                Comment: 'User is authorized',
              },
            });
          } else {
            dispatch(
              addLog({
                log: {
                  id: route.params?.qrdata,
                  Latitude: info.coords.latitude,
                  Longitude: info.coords.longitude,
                  Comment: 'User ',
                },
              }),
            );
            setLocalUser(users.find(u => u.id === route.params?.qrdata));
          }
        },
        e => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: e.message || 'Something went wrong getting the location',
          });
        },
        {
          enableHighAccuracy: true,
        },
      );
    }
  }, [run, route, navigation, dispatch, offlineStatus, users]);

  useEffect(() => {
    if (runError) {
      console.log('runError', JSON.stringify(runError));
      // setBackupData((error as any)?.data);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          (runError as any)?.error ||
          (runError as any)?.data?.message ||
          'Something went wrong with this scan',
        visibilityTime: 5000,
      });
      navigation.pop();
    }
  }, [runError, navigation]);

  console.log('runData', JSON.stringify(runData));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader visible={runLoading} />
      <Box flex={1}>
        <Box
          height={200}
          backgroundColor="primary"
          justifyContent="center"
          alignItems="center">
          <Box
            height={60}
            width={60}
            backgroundColor="white"
            borderRadius={40}
            overflow="hidden"
            justifyContent="center"
            alignItems="center">
            {!runData ? (
              <Feather name="user" size={28} color="#000000" />
            ) : (
              <Image
                source={{
                  uri: runData?.profilePicture,
                }}
                resizeMethod="scale"
                resizeMode="cover"
                style={{
                  height: 60,
                  width: '100%',
                }}
              />
            )}
          </Box>
        </Box>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box flex={1} padding="l" justifyContent="space-between">
            {/* <Text variant="medium" textAlign="center">
            Select your OTP option to proceed
          </Text> */}
            <Box></Box>
            {/* {route.params?.qrdata && (
            <Box flex={1} justifyContent="center">
              <Text variant="regular">Result: {route.params.qrdata}</Text>
            </Box>
          )} */}
            {selectedUser && (
              <Box justifyContent="center">
                <Box
                  marginBottom="l"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text variant="medium" color="primary">
                    FIRST NAME:
                  </Text>
                  <Text variant="regular" color="primary">
                    {selectedUser?.firstName}
                  </Text>
                </Box>
                <Box
                  marginBottom="l"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text variant="medium" color="primary">
                    LAST NAME:
                  </Text>
                  <Text variant="regular" color="primary">
                    {selectedUser?.lastName}
                  </Text>
                </Box>
                <Box
                  marginBottom="l"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text variant="medium" color="primary">
                    STAFF TYPE:
                  </Text>
                  <Text variant="regular" color="primary">
                    {selectedUser?.staffType || ''}
                  </Text>
                </Box>
                {/* <Box
                marginBottom="l"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <Text variant="medium" color="primary">
                  REFINERY ID:
                </Text>
                <Text variant="regular" color="primary">
                  {runData && runData?.Refineryid}
                </Text>
              </Box> */}
                <Box
                  marginBottom="l"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text variant="medium" color="primary">
                    DEPARTMENT:
                  </Text>
                  <Text variant="regular" color="primary">
                    {selectedUser?.department}
                  </Text>
                </Box>
                <Box
                  marginBottom="l"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text variant="medium" color="primary">
                    COMPANY:
                  </Text>
                  <Text variant="regular" color="primary">
                    {selectedUser?.companyName}
                  </Text>
                </Box>
                <Box
                  marginBottom="l"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text variant="medium" color="primary">
                    USER STATUS:
                  </Text>
                  <Text variant="regular" color="primary">
                    {selectedUser?.userStatus}
                  </Text>
                </Box>
                <Box
                  marginBottom="l"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text variant="medium" color="primary">
                    REFINERY ZONE:
                  </Text>
                  <Text variant="regular" color="primary">
                    {selectedUser?.refineryZones}
                  </Text>
                </Box>
                {/* {runData && (
                  <Box
                    marginTop="l"
                    borderWidth={2}
                    borderRadius={10}
                    paddingVertical="l"
                    flexDirection="row"
                    justifyContent="center"
                    paddingHorizontal="m"
                    flexWrap="wrap"
                    style={{
                      backgroundColor: addAlpha(
                        !runData?.authorized ? danger : success,
                        0.2,
                      ),
                    }}
                    borderColor={!runData?.authorized ? 'danger' : 'success'}>
                    <Text
                      variant="medium"
                      textAlign="center"
                      color={!runData?.authorized ? 'danger' : 'success'}>
                      {runData?.authorized
                        ? 'User is authorized for this location'
                        : 'User is not authorized for this location'}
                    </Text>
                  </Box>
                )} */}
                {/* <Box
              marginBottom="l"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text variant="medium" color="primary">
                ROLE:
              </Text>
              <Text variant="regular" color="primary">
                {data[0]?.FirstName}
              </Text>
            </Box> */}
              </Box>
            )}
            <Box></Box>
            {/* <Box flexDirection="row" justifyContent="space-between">
            <Box flex={1} marginRight="m">
              <Button
                disabled
                displayText="Request for OTP"
                onPress={() => setVerifyOpen(true)}
              />
            </Box>
            <Box flex={1}>
              <Button
                disabled
                displayText="OTP Unavailable"
                onPress={() => setReason(true)}
              />
            </Box>
          </Box> */}
          </Box>
        </ScrollView>
      </Box>
      <OTPSecurityModal
        isVisible={verifyOpen}
        closeModal={() => setVerifyOpen(false)}
      />
      <OTPReasonModal isVisible={reason} closeModal={() => setReason(false)} />
    </SafeAreaView>
  );
};

export default SecurityScanScreen;
