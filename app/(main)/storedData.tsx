import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DownloadedRecordsScreen = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const storedRecords = await AsyncStorage.getItem('recordData');
        if (storedRecords) {
          const parsedRecords = JSON.parse(storedRecords);

          // Check if parsedRecords is an array and has items
          if (Array.isArray(parsedRecords)) {
            setRecords(parsedRecords);
          } else {
            console.warn('Parsed records are not an array:', parsedRecords);
          }
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Downloaded Records</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.BarCodeId} // Use BarCodeId as the unique key
        renderItem={({ item }) => (
          <View style={styles.recordContainer}>
            <Text style={styles.recordTitle}>{item.FirstName} {item.LastName}</Text>
            <Text>Company: {item.CompanyName || 'N/A'}</Text>
            <Text>Department: {item.Department}</Text>
            <Text>Profile Picture: {item.ProfilePicture}</Text>
            <Text>Status: {item.UserStatus === 1 ? 'Active' : 'Inactive'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  recordContainer: { marginBottom: 12, padding: 12, borderColor: '#ccc', borderWidth: 1, borderRadius: 8 },
  recordTitle: { fontSize: 18, fontWeight: 'bold' },
});

export default DownloadedRecordsScreen;
