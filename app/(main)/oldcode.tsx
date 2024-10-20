import React, { useCallback, useEffect, useState } from 'react';
import { View, PermissionsAndroid, Switch, Modal, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Toast from 'react-native-toast-message';
import Box from '@/components/Box';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { MainStack } from '@/utils/ParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLogs } from '@/state/hooks/logs.hook';
import { useUsers } from '@/state/hooks/users.hook';
import { useDispatch } from 'react-redux';
import { useSettings } from '@/state/hooks/settings.hook';
import { setOfflineMode } from '@/state/reducers/settings.reducer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import { Feather,Ionicons  } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location'; 

interface Props {
  navigation: NativeStackNavigationProp<MainStack, 'QRScan'>;
}

const QRScanScreen = ({ navigation }: Props) => {
  const [data, setData] = useState(null);
  const [offlineStatuss, setOfflineStatus] = useState(false);
  const [offlineLoading, setOfflineLoading] = useState(false);
  const dispatch = useDispatch();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scan, setScan] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [userData, setUserData] = useState<{
    Department: string;
    RefineryZones: string;
    StaffType: string;
    UserStatus: string;
    BarCodeId: string;
    firstName: string;
    lastName: string;
    companyName: string;
    profilePicture: string;
    Authorized: boolean;
  } | null>(null);

  const { logs } = useLogs();
  const { users } = useUsers();
  const { offlineStatus } = useSettings();
  const [offlineScans, setOfflineScans] = useState([]); // To store offline scanned data
const [offlineScanCount, setOfflineScanCount] = useState(0);



  const logBaseUrl = 'https://sj.api.dev.dangote.islands.digital';
  // const defaultLatitude = '6.5244';
  // const defaultLongitude = '3.3792';
  const [location, setLocation] = useState<{ latitude?: string, longitude?: string }>({
    latitude: undefined,  // No default value
    longitude: undefined, // No default value
  });


   // Function to request location permission and get the user's location
   const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        Toast.show({
          type: 'error',
          text1: 'Location permission denied',
        });
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setLocation({ latitude: latitude.toString(), longitude: longitude.toString() });
      console.log('User Location:', latitude, longitude);

    } catch (error) {
      console.error('Error fetching location', error);
      Toast.show({
        type: 'error',
        text1: 'Unable to fetch location',
      });
    }
  };

  useEffect(() => {
    // Fetch user location when the component mounts
    getUserLocation();
  }, []);

  const userLatitude = location.latitude ?? 'Unavailable';
  const userLongitude = location.longitude ?? 'Unavailable';




  useEffect(() => {
    // Fetch and store staff data when the component loads
    fetchAndStoreStaffData();
  }, []);



  const fetchAndStoreStaffData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://sj.api.dev.dangote.islands.digital/api/Staff');
      const staffData = response.data;
      await AsyncStorage.setItem('staffData', JSON.stringify(staffData));
      setData(staffData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Staff data updated and stored locally.',
      });
    } catch (error) {
      console.error('Failed to fetch staff data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update staff data.',
      });
    } finally {
      setLoading(false);
    }
  };




  const setOffline = useCallback(
    (value: boolean) => {
      setOfflineLoading(true);
      // Simulate an API call or state change delay
      setTimeout(() => {
        dispatch(setOfflineMode({ value }));
        setOfflineStatus(value); // Update local state when toggling
        setOfflineLoading(false);
        Toast.show({
          type: 'success',
          text1: value ? 'Offline Mode' : 'Online Mode',
          text2: `You are now in ${value ? 'offline' : 'online'} mode.`,
        });
      }, 1500);
    },
    [dispatch]
  );

  const requestPermissions = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Camera permission required',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    requestPermissions();

    // Set up the network status listener
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOffline = !state.isConnected;
      setOfflineStatus(isOffline);
      setOffline(isOffline); // Update Redux state to match
      Toast.show({
        type: isOffline ? 'error' : 'success',
        text1: isOffline ? 'Offline' : 'Online',
        text2: isOffline ? 'You are now offline.' : 'You are back online.',
      });
    });

    // Clean up the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [setOffline]);

const handleBarCodeScanned = async ({ type, data }) => {
  setScan(false);
  setLoading(true); // Show loading overlay

  try {
    if (offlineStatus) {
      // Handle offline mode: Search through the locally stored data
      const storedData = await AsyncStorage.getItem('staffData');
      if (storedData) {
        const staffList = JSON.parse(storedData);
        const staffMember = staffList.find(item => item.BarCodeId === data);
        if (staffMember) {
          setUserData({
            firstName: staffMember.FirstName,
            lastName: staffMember.LastName,
            companyName: staffMember.CompanyName,
            profilePicture: staffMember.ProfilePicture,
            BarCodeId: staffMember.BarCodeId,
            UserStatus: staffMember.UserStatus,
            StaffType: staffMember.StaffType,
            RefineryZones: staffMember.RefineryZones,
            Department: staffMember.Department,
            Authorized: staffMember.Authorized,
          });
          setModalVisible(true);

          // Store the offline scan data for later upload
          setOfflineScans(prevState => [...prevState, staffMember]);
          setOfflineScanCount(prevCount => prevCount + 1);

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Staff data found in offline mode.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Not Found',
            text2: 'No matching data found in offline mode.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'No Data',
          text2: 'No offline data available.',
        });
      }
    } else {
      // Handle online mode: Fetch data from API
      const response = await axios.get(`${logBaseUrl}/api/staff/barcode`, {
        params: {
          id: data,
          Latitude: userLatitude,
          Longitude:userLongitude,
          Comment: 'User is authorized',
        },
      });

      
      const {
        FirstName,
        LastName,
        CompanyName,
        ProfilePicture,
        BarCodeId,
        UserStatus,
        StaffType,
        RefineryZones,
        Department,
        Authorized
      } = response.data;

      setUserData({
        firstName: FirstName,
        lastName: LastName,
        companyName: CompanyName,
        profilePicture: ProfilePicture,
        BarCodeId: BarCodeId,
        UserStatus: UserStatus,
        StaffType: StaffType,
        RefineryZones: RefineryZones,
        Department: Department,
        Authorized: Authorized,

      });
      setModalVisible(true);
      console.log('staffs data:', response);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'QR Code processed successfully!',
      });
    }
  } catch (error) {
    console.log('API Error:', error.response || error.message);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to process QR code',
    });
  } finally {
    setLoading(false); // Hide loading overlay
  }
};
  
  

  const renderModalContent = () => {
    if (!userData) return null;



    const containerStyle = {
      backgroundColor: userData.Authorized ? '#fef2f2' : '#fee2e2', // background color
      borderRadius: 8,
      padding: 16, // padding added here
      marginBottom: 16,
    };
  
    const textStyle = {
      color: userData.Authorized ? '#dc2626' : '#f87171', // text color
      fontWeight: userData.Authorized ? '500' : 'bold', // font weight
      paddingHorizontal: 8, // horizontal padding
      paddingVertical: 4,   // vertical padding
    };


    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        
        <Box style={styles.modalContainer}>
          
          <Box style={styles.modalContent}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginBottom:10}}>
                      <Ionicons name="arrow-back" size={24} color="black" />
           </TouchableOpacity>
            <Box height={200} backgroundColor="primary" justifyContent="center" alignItems="center">
              
              <Box
                height={200}
                width={200}
                backgroundColor="white"
                borderRadius={100}
                overflow="hidden"
                justifyContent="center"
                alignItems="center"
              >
                {!userData ? (
                  <Feather name="user" size={28} color="#000000" />
                ) : (
                  <Image
                  source={{ uri: userData.profilePicture }}
                  resizeMethod="auto"
                  resizeMode="contain"
                  style={{ height: 250, width: 250 }}
                />
                
                )}
              </Box>
            </Box>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Box flex={1} padding="l" justifyContent="space-between">
                
              
                <Box></Box>
                {userData && (
                  <Box justifyContent="center">
                    <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">FIRST NAME: </Text>
                      <Text variant="regular" color="primary">{userData.firstName}</Text>
                    </Box>
                    <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">LAST NAME: </Text>
                      <Text variant="regular" color="primary">{userData.lastName}</Text>
                    </Box>
                    <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">COMPANY: </Text>
                      <Text variant="regular" color="primary">{userData.companyName}</Text>
                    </Box>
                    <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">USER STATUS: </Text>
                      <Text variant="regular" color="primary">{userData.UserStatus}</Text>
                    </Box>
                    <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">STAFF TYPE: </Text>
                      <Text variant="regular" color="primary">{userData.StaffType}</Text>
                    </Box>
                    <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">REFINERY ZONES: </Text>
                      <Text variant="regular" color="primary">{userData.RefineryZones}</Text>
                    </Box>
                    <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">DEPARTMENT: </Text>
                      <Text variant="regular" color="primary">{userData.Department}</Text>
                    </Box>
                    <Box
                    marginBottom="l"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    style={containerStyle}
                  >
                    {/* <Text variant="medium" color="primary">AUTHORIZED: </Text> */}
                    <Text variant="regular" style={textStyle}>
                      {userData.Authorized ? 'User is authorized' : 'User is not authorized'}
                    </Text>
                  </Box>

                   
                  </Box>
                )}
              </Box>
            </ScrollView>
          </Box>
        </Box>
      </Modal>
    );
  };

  const LoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );

  if (hasPermission === null) {
    return <View><Text>Requesting for camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && <LoadingOverlay />}
      {scan ? (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeScanned={scan ? handleBarCodeScanned : undefined}
            style={{ flex: 1 }}
          />
          <Box paddingHorizontal="l" width="100%" justifyContent="center">
            <Box marginBottom="l">
              <Button onPress={() => setScan(false)} displayText="Cancel Scan" />
            </Box>
          </Box>
        </View>
      ) : (
        <Box paddingHorizontal="l" flex={1} justifyContent="center">
        <Box marginBottom="l">
          <Button onPress={() => setScan(true)} displayText="Scan" />
        </Box>
        {/* <Box marginBottom="l">
          <Button
            onPress={() => navigation.navigate('CreateNewUser')}
            displayText="Register User"
          />
        </Box> */}
        {/* <Box marginBottom="l">
        <Button displayText="Update Staff Data" onPress={fetchAndStoreStaffData} disabled={loading} /> 
        </Box> */}
        <Box marginBottom="l">
          <Button
            // onPress={() => navigation.navigate('CreateNewUser')}
            displayText="Update Local Database"
          />
        </Box>
        <Box marginBottom="l">
          <Button
            // onPress={() => navigation.navigate('CreateNewUser')}
            displayText="Upload offline logs"
          />
        </Box>
        <Box alignItems="center" marginBottom="l">
          <Text variant="medium">
            Total users in local database: {logs.length}
          </Text>
          <Text variant="medium">
            Total logs to be uploaded:{offlineScanCount}
            {/* x {users.length} */}
          </Text>
        </Box>
        <Box alignItems="center">
            <Text variant="medium" fontSize={12}>
                Offline Mode
            </Text>
            <Switch value={offlineStatuss} onValueChange={setOffline} />
            
            {offlineStatus ? (
                <Text>You are in offline mode. Using cached data.</Text>
            ) : (
                <Text>You are in online mode. Using live data.</Text>
            )}
            {/* <Text>{data ? JSON.stringify(data) : 'No data available'}</Text> */}
        </Box>
      </Box>
      )}
      {renderModalContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 1000, // Bring modal to front
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    zIndex: 1001, // Ensure modal content is above the container
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure overlay is above other content
  },
});

export default QRScanScreen;
