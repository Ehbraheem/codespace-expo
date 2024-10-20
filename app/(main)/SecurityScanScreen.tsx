import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as Location from 'expo-location';
import Box from '@/components/Box';
import Text from '@/components/Text';
import Loader from '@/components/Loader';
import OTPReasonModal from '@/components/OTPReasonModal';
import OTPSecurityModal from '@/components/OTPSecurityModal';
import { useRouter, useRoute } from 'expo-router'; // Import necessary hooks
import { useRunMutation } from '@/state/services/utils.service';
import { logBaseUrl } from '@/utils/helpers';
import { useSettings } from '@/state/hooks/settings.hook';
import { useDispatch } from 'react-redux';
import { addLog } from '@/state/reducers/logs.reducer';
import { useUsers } from '@/state/hooks/users.hook';
import { Users } from '@/utils/types';

const SecurityScanScreen = () => {
  const router = useRouter(); // Access router
  const route = useRoute(); // Access route

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [reason, setReason] = useState(false);
  const [localUser, setLocalUser] = useState<Users | undefined>(undefined);

  const [run, { isLoading: runLoading, error: runError, data: runData }] = useRunMutation();
  const { offlineStatus } = useSettings();
  const { users } = useUsers();
  const dispatch = useDispatch();

  const selectedUser = useMemo(
    () => localUser || (runData as typeof localUser),
    [localUser, runData]
  );

  useEffect(() => {
    const fetchLocationAndRun = async () => {
      const qrdata = route.params?.qrdata; // Access qrdata from route.params
      if (!qrdata) {
        console.error('Invalid QR Code');
        router.back(); // Navigate back if qrdata is not available
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      if (!offlineStatus) {
        run({
          url: `${logBaseUrl}/api/staff/barcode`,
          method: 'GET',
          params: {
            id: qrdata,
            Latitude: latitude,
            Longitude: longitude,
            Comment: 'User is authorized',
          },
        });
      } else {
        dispatch(
          addLog({
            log: {
              id: qrdata,
              Latitude: latitude,
              Longitude: longitude,
              Comment: 'User authorized (offline)',
            },
          })
        );
        setLocalUser(users.find(u => u.id === qrdata));
      }
    };

    fetchLocationAndRun();
  }, [run, route.params?.qrdata, router, dispatch, offlineStatus, users]);

  useEffect(() => {
    if (runError) {
      console.error(
        (runError as any)?.error || (runError as any)?.data?.message || 'Something went wrong with this scan'
      );
      router.back();
    }
  }, [runError, router]);

  useEffect(() => {
    if (runData) {
      console.log('API Response:', runData);
    }
  }, [runData]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader visible={runLoading} />
      <Box flex={1}>
        <Box height={200} backgroundColor="primary" justifyContent="center" alignItems="center">
          <Box
            height={60}
            width={60}
            backgroundColor="white"
            borderRadius={40}
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
          >
            {!runData ? (
              <Feather name="user" size={28} color="#000000" />
            ) : (
              <Image
                source={{ uri: runData?.profilePicture }}
                resizeMethod="scale"
                resizeMode="cover"
                style={{ height: 60, width: '100%' }}
              />
            )}
          </Box>
        </Box>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box flex={1} padding="l" justifyContent="space-between">
            <Box></Box>
            {selectedUser && (
              <Box justifyContent="center">
                <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Text variant="medium" color="primary">FIRST NAME: </Text>
                  <Text variant="regular" color="primary">{selectedUser?.firstName}</Text>
                </Box>
                <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Text variant="medium" color="primary">LAST NAME: </Text>
                  <Text variant="regular" color="primary">{selectedUser?.lastName}</Text>
                </Box>
              </Box>
            )}
            <Box>
              <Box marginBottom="m">
                <Button displayText="Verify" onPress={() => setVerifyOpen(true)} />
              </Box>
              <Box marginBottom="m">
                <Button displayText="Open Reason Modal" onPress={() => setReason(true)} />
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </Box>
      <OTPSecurityModal visible={verifyOpen} setVisible={setVerifyOpen} />
      <OTPReasonModal visible={reason} setVisible={setReason} />
    </SafeAreaView>
  );
};

export default SecurityScanScreen;
