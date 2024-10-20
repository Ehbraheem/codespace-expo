import React, { useState } from 'react';
import Box from './Box';
import Text from './Text';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import BottomSheet from './BottomSheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { Order } from '@/utils/types';
import { shippingStatuses } from '@/utils/helpers';

interface Props {
  order: Order;
}

const ShippingCard = ({ order }: Props) => {
  const [visible, setVisible] = useState(false);
  const mainnavigation =
    useNavigation<NativeStackNavigationProp<MainStack, 'Tab'>>();

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
              {order?.title && order.title.length > 12
                ? order.title?.substring(0, 12) + '...'
                : order?.title || 'No title'}
            </Text>
            <Text
              variant="medium"
              fontSize={15}
              style={{ color: '#474A56', flexWrap: 'wrap' }}>
              {order.shipping?.poNumber && order.shipping.poNumber.length > 12
                ? order.shipping?.poNumber.substring(0, 12) + '...'
                : order.shipping?.poNumber}
            </Text>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            {order.orderStatus !== null && order.orderStatus > 2 ? (
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
                  {shippingStatuses.find(
                    ss => ss.annotation === order.orderStatus,
                  )?.title || 'Shipped'}
                </Text>
              </Box>
            ) : (
              <Box
                height={21}
                borderRadius={4}
                paddingHorizontal="s"
                justifyContent="center"
                style={{
                  backgroundColor: '#FFF0BA',
                }}>
                <Text
                  variant="regular"
                  textTransform="uppercase"
                  color="black"
                  fontSize={10}>
                  {shippingStatuses.find(
                    ss => ss.annotation === order.orderStatus,
                  )?.title || 'Awaiting shipping'}
                </Text>
              </Box>
            )}
            <Text variant="regular" fontSize={12} style={{ color: '#8A8A8A' }}>
              {order.shipping?.created
                ? new Date(order.shipping?.created).toLocaleDateString('en-US')
                : null}
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
                  {order.title}
                </Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <MaterialIcons name="close" size={20} color="#C8D1E1" />
                </TouchableOpacity>
              </Box>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                {order.orderStatus !== null && order.orderStatus > 2 ? (
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
                      {shippingStatuses.find(
                        ss => ss.annotation === order.orderStatus,
                      )?.title || 'Shipped'}
                    </Text>
                  </Box>
                ) : (
                  <Box
                    height={21}
                    borderRadius={4}
                    paddingHorizontal="s"
                    justifyContent="center"
                    style={{
                      backgroundColor: '#FFF0BA',
                    }}>
                    <Text
                      variant="regular"
                      textTransform="uppercase"
                      color="black"
                      fontSize={10}>
                      {shippingStatuses.find(
                        ss => ss.annotation === order.orderStatus,
                      )?.title || 'Awaiting shipping'}
                    </Text>
                  </Box>
                )}
                <Text
                  variant="regular"
                  fontSize={12}
                  style={{ color: '#8A8A8A' }}>
                  {order.shipping?.created
                    ? new Date(order.shipping?.created).toLocaleDateString(
                        'en-US',
                      )
                    : null}
                </Text>
              </Box>
            </Box>
            <Box marginTop="l" flex={1}>
              <ScrollView>
                {order.shipping &&
                  Object.entries(order.shipping)
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
                  setVisible(false);
                  mainnavigation.navigate('OrderReport', {
                    order,
                  });
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

export default ShippingCard;
