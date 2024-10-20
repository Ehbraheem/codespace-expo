import React, { useCallback, useEffect, useState } from 'react';
import { View, PermissionsAndroid, Switch, Modal, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
import * as FileSystem from 'expo-file-system';
import RNPickerSelect from 'react-native-picker-select';
// import { Ionicons } from '@expo/vector-icons';




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
    RefineryZone: string;
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
const [responseMessage, setResponseMessage] = useState('')
const [isVerified, setIsVerified] = useState(null);

const [selectedId, setSelectedId] = useState(null);
const [message, setMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
 const [modalVisibles, setModalVisibles] = useState(false);
//  const [loading, setLoading] = useState(false); 
const [uploading, setUploading] = useState(false);





const options = [
  { label: 'A1', value: 'A1' },
  { label: 'A2', value: 'A2' },
  { label: 'A3', value: 'A3' },
  { label: 'A4', value: 'A4' },
];

// download file

// const downloadFile = async () => {
//   if (!selectedId) {
//     Alert.alert('Error', 'Please select an ID');
//     return;
//   }

//   const apiUrl = `https://sj.api.dev.dangote.islands.digital/api/offline/download/record?id=${selectedId}&type=file`;
//   const fileUri = `${FileSystem.documentDirectory}${selectedId}.zip`;

//   try {
//     // Download the file
//     const response = await FileSystem.downloadAsync(apiUrl, fileUri);

//     if (response.status === 200) {
//       Alert.alert('Success', `Downloaded ${selectedId}.zip to ${fileUri}`);
//       // Call your unzip method here if necessary
//     } else {
//       console.log('Error', response);
//     }
//   } catch (error) {
//     console.error('Download error:', error);
    
//     // Check if error has a response and extract message
//     const errorMessage = error.response
//       ? `Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`
//       : 'Something went wrong while downloading the file';

//     Alert.alert('Error', errorMessage);
//   }
// };



const getRecord = async () => {
  setLoading(true); // Set loading to true when the function starts
  try {
    const response = await axios.get(`https://sj.api.dev.dangote.islands.digital/api/offline/download/record?id=${selectedId}`);
    console.log('Downloaded data:', response.data); // Log the downloaded data
    
    setMessage('Record downloaded successfully.');
    setModalVisibles(true); // Show modal immediately after logging
    console.log('Downloaded data:', response.data);

    await storeRecord(response.data); // Store the data for uploading
    // await uploadRecord(); // Uncomment this if you want to upload after downloading
  } catch (error) {
    console.error('Error downloading record:', error);
    setErrorMessage('Failed to download record.');
    setModalVisibles(true); // Show modal on error
  } finally {
    setLoading(false); // Set loading to false when done
  }
};

const storeRecord = async (data) => {
  try {
    console.log('Storing record:', data); // Log the data before storing
    await AsyncStorage.setItem('recordData', JSON.stringify(data));
    console.log('Record stored successfully');
  } catch (error) {
    console.error('Error storing record:', error);
    setErrorMessage('Failed to store record.');
  }
};

const uploadRecord = async () => {
  setUploading(true); // Set uploading to true when starting to upload
  try {
    const storedData = await AsyncStorage.getItem('recordData'); // Retrieve stored data
    if (storedData) {
      const data = JSON.parse(storedData); // Parse the JSON string back to an object
      const response = await axios.post('https://sj.api.dev.dangote.islands.digital/api/offline/upload/record', data);
      console.log('Upload response:', response.data); // Log the upload response

      // Show success message and display the modal immediately after logging the upload response
      setMessage('Record uploaded successfully.');
      setModalVisible(true);
    } else {
      setErrorMessage('No record data found to upload.');
      setModalVisibles(true); // Show modal if no data is found
    }
  } catch (error) {
    console.error('Error uploading record:', error);
    setErrorMessage('Failed to upload record.');
    setModalVisible(true); // Show modal on error
  } finally {
    setUploading(false); // Set uploading to false when done
  }
};



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

  const handleVerify = async () => {
    if (!userData || !userData.BarCodeId) {
      Alert.alert('Error', 'BarCodeId is missing');
      return;
    }

    // http://localhost:26147/api/staff/barcode/verify?Id=8E6D9C7D-EB0D-4402-9955-E6C22812198A&Longitude=3.543895&Latitude=6.556775/
  
    // const apiUrl = `https://sj.api.dev.dangote.islands.digital/api/staff/barcode/verify?Id=${userData.BarCodeId}`;
    const apiUrl = `https://sj.api.dev.dangote.islands.digital/api/staff/barcode/verify?Id=${userData.BarCodeId}&Longitude=${userLongitude}&Latitude=${userLatitude}`;
  
    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      console.log('Parsed JSON result:', result);
  
      if (response.ok) {
        setIsVerified(result); // Assuming result is a boolean
        setResponseMessage(`Verification result: ${result}`); // Display true/false
      } else {
        setIsVerified(false);
        setResponseMessage(result.message || 'Failed to update');
      }
      // if (response.ok) {
      //   const verified = Boolean(result); // Convert result to a boolean
      //   setIsVerified(verified); // Set verification status
      //   setResponseMessage(verified ? 'Verified' : 'Not Verified'); // Set response message
      // } else {
      //   setIsVerified(false);
      //   setResponseMessage(result.message || 'Failed to update');
      // }
    } catch (error) {
      console.error('Fetch error:', error);
      setResponseMessage('Something went wrong');
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };
  
  

  



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
      console.log('Failed to fetch staff data:', error.response);
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
            RefineryZone: staffMember.RefineryZone,
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
        RefineryZone,
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
        RefineryZone: RefineryZone,
        Department: Department,
        Authorized: Authorized,
      });
      setModalVisible(true);
      console.log('staffs data:', response.data);

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

    const closeModal = () => {
      setModalVisible(false);
      setResponseMessage(''); // Reset response message
      setIsVerified(null); // Reset isVerified state
    };


    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        
        <Box style={styles.modalContainer}>
          
          <Box style={styles.modalContent}>
          <TouchableOpacity onPress={closeModal} style={{marginBottom:10}}>
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
                    <Text variant="medium" color="primary">REFINERY ZONE: </Text>
                    <Box>
                              {Array.isArray(userData.RefineryZone)
                                ? userData.RefineryZone[0].split(',').map((zone, index) => (
                                    <Text key={index} variant="regular" color="primary">{zone.trim()}</Text>
                                  ))
                                : userData.RefineryZone.split(',').map((zone, index) => (
                                    <Text key={index} variant="regular" color="primary">{zone.trim()}</Text>
                                  ))
                              }
                              </Box>
                            </Box>


                    <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">DEPARTMENT: </Text>
                      <Text variant="regular" color="primary">{userData.Department}</Text>
                    </Box>
                    {/* <Box marginBottom="l" flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text variant="medium" color="primary">DEPARTMENT: </Text>
                      <Text variant="regular" color="primary">{userData.BarCodeId}</Text>
                    </Box> */}
                    {/* <Box
                    marginBottom="l"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    style={containerStyle}
                  >
                    <Text variant="regular" style={textStyle}>
                      {userData.Authorized ? 'User is authorized' : 'User is not authorized'}
                    </Text>
                  </Box> */}
                        {/* <Box
                  marginBottom="l"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  style={containerStyle}
                >
                  <Text variant="regular" style={textStyle}>
                    {responseMessage}
                  </Text>
                </Box>
                      <Button
                        onPress={handleVerify}
                        displayText={loading ? 'Verifying...' : 'Verify'}
                        disabled={loading}
                      /> */}

                {responseMessage && (
                        <View style={{
                          backgroundColor: isVerified === true ? '#d1fae5' : isVerified === false ? '#fee2e2' : 'transparent',
                          padding: 16,
                          borderRadius: 8,
                          marginBottom: 16,
                        }}>
                          <Text style={{
                            color: isVerified === true ? '#065f46' : isVerified === false ? '#dc2626' : '#000',
                            fontWeight: 'bold',
                          }}>
                           {responseMessage} {/* This will display "Verified" or "Not Verified" */}
                          </Text>
                        </View>
                      )}
                    
                    <Button onPress={handleVerify} displayText={loading ? "Verifying..." : "Verify Location"} />

                   
                  </Box>
                )}
              </Box>
            </ScrollView>
          </Box>
        </Box>
      </Modal>
    );
  };


  const closeModal = () => {
    setModalVisibles(false);
    setMessage(''); // Clear messages when closing
    setErrorMessage('');
  };


  const handleDownloadRecords = async () => {
    const apiUrl = "https://sj.api.dev.dangote.islands.digital/api/offline/download/record";
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Downloaded records:', result);
  
        // Handle the downloaded data here
        // e.g., save it to a file or display a success message
        Alert.alert('Success', 'Records downloaded successfully');
      } else {
        console.error('Failed to download records:', response, response.statusText);
        Alert.alert('Error', 'Failed to download records');
      }
    } catch (error) {
      console.error('Fetch error:', error.response);
      Alert.alert('Error', 'Something went wrong while downloading records');
    }
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
      <TouchableOpacity style={styles.navigateContainer} onPress={() => navigation.navigate('StoredDataScreen')}>
      <Text style={styles.navigateText}>View downloaded Records</Text>
        <Ionicons name="arrow-forward" size={24} color="black" />
       
      </TouchableOpacity>

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
           <RNPickerSelect
            onValueChange={(value) => setSelectedId(value)}
            items={options}
            placeholder={{ label: 'Select an ID...', value: null }}
          />
        <Box marginBottom="l">
        {/* <Button
          // onPress={handleDownloadRecords}
          // onPress={downloadFile}
          onPress={getRecord}
          displayText="Download records"
        /> */}

            <Button
            displayText={loading ? 'Loading...' : 'Download Records'} // Change button text based on loading state
            onPress={getRecord}
            disabled={loading} // Disable the button when loading
          />
        </Box>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibles}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          <Text style={errorMessage ? styles.errorText : styles.successText}>
            {errorMessage || message}
          </Text>
          <TouchableOpacity style={styles.button} onPress={closeModal}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={uploading}
      >
        <View style={styles.loadingModal}>
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      </Modal>
        <Box marginBottom="l">
          {/* <Button
            // onPress={() => navigation.navigate('CreateNewUser')}
            displayText="Upload records"
          /> */}
           <Button
        displayText={uploading ? 'Uploading...' : 'Upload Record'} // Change button text based on uploading state
        onPress={uploadRecord}
        disabled={uploading} // Disable the button when uploading
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successText: {
    color: 'green',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  // navigateText: {
  //   fontSize: 16,
  //   color: 'blue',
  //   marginTop: 4,
  // },
  navigateContainer: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',  // Center vertically
    marginTop: 40,        // Adjust the top margin to bring it down
  },
  navigateText: {
    marginLeft: 8,        // Space between icon and text
    fontSize: 16,         // Text size
  },
});

export default QRScanScreen;
