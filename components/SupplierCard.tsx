import React, { useState } from 'react';
import Box from './Box';
import Text from './Text';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import BottomSheet from './BottomSheet';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { MainStack } from '@/utils/ParamList';
import { Supplier } from '@/utils/types';
import EditSupplierModal from './EditSupplierModal';

interface Props {
  supplier: Supplier;
  refetch: () => void;
}

const SupplierCard = ({ supplier, refetch }: Props) => {
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  // const mainnavigation =
  //   useNavigation<NativeStackNavigationProp<MainStack, 'Tab'>>();

  return (
    <>
      <Box
        marginBottom="m"
        borderRadius={6}
        padding="mid"
        flexDirection="row"
        alignItems="center"
        style={{
          backgroundColor: '#F8F8FA',
        }}>
        <Box flex={1}>
          <Box
            marginBottom="mid"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text
              variant="medium"
              fontSize={15}
              style={{ color: '#474A56' }}
              marginRight="m">
              {supplier.name}
            </Text>
            <Text
              variant="medium"
              fontSize={15}
              style={{ color: '#474A56', flexWrap: 'wrap' }}>
              ID: {supplier.supplierId}
            </Text>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Box
              height={21}
              borderRadius={4}
              paddingHorizontal="s"
              justifyContent="center"
              style={{
                backgroundColor: '#CCFFBA',
              }}>
              <Text
                variant="regular"
                textTransform="uppercase"
                color="black"
                fontSize={10}>
                {supplier.country || 'Status'}
              </Text>
            </Box>
            <Text variant="regular" fontSize={12} style={{ color: '#8A8A8A' }}>
              {supplier.phone}
            </Text>
          </Box>
        </Box>
        <Box marginLeft="s">
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={{ padding: 10 }}>
            <Feather name="chevron-right" size={14} color="#000" />
          </TouchableOpacity>
        </Box>
      </Box>
      <BottomSheet isVisible={visible} closeModal={() => setVisible(false)}>
        <Box
          marginVertical="l"
          style={{
            height: Dimensions.get('window').height * 0.75,
          }}>
          <Box flex={1}>
            <Box>
              <Box
                marginBottom="l"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Text
                  variant="medium"
                  fontSize={18}
                  style={{ color: '#474A56' }}>
                  {supplier.name}
                </Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <MaterialIcons name="close" size={20} color="#C8D1E1" />
                </TouchableOpacity>
              </Box>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <Box
                  height={21}
                  borderRadius={4}
                  paddingHorizontal="s"
                  justifyContent="center"
                  style={{
                    backgroundColor: '#CCFFBA',
                  }}>
                  <Text
                    variant="regular"
                    textTransform="uppercase"
                    color="black"
                    fontSize={10}>
                    {supplier.country || 'Status'}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box marginTop="l" flex={1}>
              <ScrollView>
                {supplier &&
                  Object.entries(supplier)
                    .filter(f => !f[0].includes('lastModified'))
                    .map(v => (
                      <Box
                        key={v[0]}
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        paddingBottom="xs"
                        marginBottom="l"
                        borderBottomWidth={1}
                        borderBottomColor="border">
                        <Text
                          variant="regular"
                          fontSize={11}
                          opacity={0.6}
                          textTransform="uppercase"
                          color="primary">
                          {v[0]}
                        </Text>
                        <Text variant="medium" style={{ color: '#474A56' }}>
                          {v[1]?.toString()}
                        </Text>
                      </Box>
                    ))}
              </ScrollView>
            </Box>
          </Box>
          <Box marginVertical="pad" flexDirection="row">
            <Box marginRight="mid">
              <TouchableOpacity
                onPress={() => {
                  // setVisible(false);
                  setEdit(true);
                }}>
                <Box
                  height={40}
                  borderWidth={1}
                  borderColor="primary"
                  borderRadius={6}
                  backgroundColor="white"
                  justifyContent="center"
                  alignItems="center"
                  paddingHorizontal="xl">
                  <Text variant="regular" fontSize={12} color="primary">
                    Edit
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
        <EditSupplierModal
          visible={edit}
          closeModal={() => setEdit(false)}
          fields={{
            address: supplier.address || '',
            country: supplier.country || '',
            email: supplier.email || '',
            id: supplier.supplierId || 0,
            name: supplier.name || '',
            phone: supplier.phone || '',
          }}
          refetch={refetch}
        />
      </BottomSheet>
    </>
  );
};

export default SupplierCard;
