import React, { useEffect } from 'react';
import Box from './Box';
import Text from './Text';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { Shipment } from '@/utils/types';
import { useGetOrderMutation } from '@/state/services/order.service';
import { Chase } from 'react-native-animated-spinkit';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/utils/theme';
import Toast from 'react-native-toast-message';

interface Props {
  shipment: Shipment;
}

const ShipmentCard = ({ shipment }: Props) => {
  const mainnavigation =
    useNavigation<NativeStackNavigationProp<MainStack, 'Tab'>>();
  const theme = useTheme<Theme>();
  const { primary } = theme.colors;
  const [getOrder, { isLoading, data, error, reset }] = useGetOrderMutation();

  useEffect(() => {
    if (data) {
      mainnavigation.navigate('OrderReport', {
        order: data.data,
      });
      reset();
    }

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          (error as any)?.error ||
          (error as any)?.data?.message ||
          'Something went wrong',
      });
      reset();
    }
  }, [data, error, reset, mainnavigation]);

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
              {shipment.poNumber}
            </Text>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Text variant="regular">Loading date</Text>
            <Text variant="regular" fontSize={12} style={{ color: '#8A8A8A' }}>
              {shipment.loadingDate
                ? new Date(shipment.loadingDate).toLocaleDateString('en-US')
                : null}
            </Text>
          </Box>
          {isLoading && (
            <Box paddingVertical="l" alignItems="center">
              <Chase size={20} color={primary} />
            </Box>
          )}
        </Box>
        <Box marginLeft="s">
          <TouchableOpacity
            onPress={() => getOrder(shipment.orderId.toString())}
            style={{ padding: 10 }}>
            <Feather name="chevron-right" size={14} color="#000" />
          </TouchableOpacity>
        </Box>
      </Box>
    </>
  );
};

export default ShipmentCard;
