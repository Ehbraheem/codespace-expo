import React, { useState } from 'react';
import Box from './Box';
import Text from './Text';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { MainStack } from '@/utils/ParamList';
import { Users } from '@/utils/types';
import { businessUnits, UserTypes } from '@/utils/helpers';
import BottomSheet from './BottomSheet';

interface Props {
  user: Users;
}

const UserCard = ({ user }: Props) => {
  const [visible, setVisible] = useState(false);
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
              {user.firstName} {user.lastName}
            </Text>
            <Text
              variant="medium"
              fontSize={15}
              style={{ color: '#474A56', flexWrap: 'wrap' }}>
              ID: {user.id.substring(0, 10)}
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
                {UserTypes.find(ss => ss.annotation === user.userType)?.title ||
                  'User'}
              </Text>
            </Box>
            <Text variant="regular" fontSize={12} style={{ color: '#8A8A8A' }}>
              Status: {user.isActive ? 'Active' : 'Pending'}
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
                  {user.firstName} {user.lastName}
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
                    {UserTypes.find(ss => ss.annotation === user.userType)
                      ?.title || 'Status'}
                  </Text>
                </Box>
                <Text
                  variant="regular"
                  fontSize={12}
                  style={{ color: '#8A8A8A' }}>
                  {user.isActive ? 'Active' : 'Pending'}
                </Text>
              </Box>
            </Box>
            <Box marginTop="l" flex={1}>
              <ScrollView>
                {user &&
                  Object.entries(user)
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
                          {v[0] === 'businessUnit'
                            ? businessUnits.find(
                                b =>
                                  b.annotation.toString() === v[1]?.toString(),
                              )?.title
                            : v[0] === 'userType'
                            ? UserTypes.find(
                                u =>
                                  u.annotation.toString() === v[1]?.toString(),
                              )?.title
                            : v[0] === 'gender'
                            ? ['Male', 'Female'].find(
                                (_, i) => i.toString() === v[1]?.toString(),
                              )
                            : v[1]?.toString()}
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
                  setVisible(false);
                  // mainnavigation.navigate('OrderReport', {
                  //   order,
                  // });
                }}>
                <Box
                  height={40}
                  borderRadius={6}
                  backgroundColor="primary"
                  justifyContent="center"
                  alignItems="center"
                  paddingHorizontal="xl">
                  <Text variant="regular" fontSize={12} color="white">
                    View
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
            <Box marginRight="mid">
              <TouchableOpacity>
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
      </BottomSheet>
    </>
  );
};

export default UserCard;
