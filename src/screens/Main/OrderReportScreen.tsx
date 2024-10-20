import Box from '@/components/Box';
import FileCard from '@/components/FileCard';
import Text from '@/components/Text';
import { useGetShippingDocMutation } from '@/state/services/shipping.service';
import { shippingStatuses } from '@/utils/helpers';
import { MainStack } from '@/utils/ParamList';
import { Theme } from '@/utils/theme';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import Toast from 'react-native-toast-message';

interface Props {
  route: RouteProp<MainStack, 'OrderReport'>;
}

const OrderReportScreen = ({ route }: Props) => {
  const theme = useTheme<Theme>();
  const { primary } = theme.colors;
  const { order } = route.params;
  const [
    getShippingDoc,
    { isLoading: docLoading, data: docData, error: docError, reset: docReset },
  ] = useGetShippingDocMutation();
  const [shippingDocs, setShippingDocs] = useState<
    { documentName: string; documentType: any; shippingDocsId: number }[]
  >([]);

  useEffect(() => {
    getShippingDoc(order.orderId as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (docData) {
      setShippingDocs(docData.data);
      docReset();
    }

    if (docError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          (docError as any)?.error ||
          (docError as any)?.data?.message ||
          'Something went wrong',
      });
      docReset();
    }
  }, [docData, docReset, docError]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} padding="l">
        <ScrollView>
          <Box
            marginBottom="l"
            flexDirection="row"
            alignItems="center"
            flexWrap="wrap"
            justifyContent="space-between">
            <Text variant="medium" fontSize={18} style={{ color: '#474A56' }}>
              {order.title}
            </Text>
            <Box flexDirection="row">
              <Box
                height={21}
                borderRadius={4}
                marginRight="m"
                paddingHorizontal="s"
                justifyContent="center"
                alignItems="center"
                style={{
                  backgroundColor: order.accepted ? '#009be5' : '#B501A3',
                }}>
                <Text
                  variant="regular"
                  textTransform="uppercase"
                  textAlign="center"
                  color="white"
                  fontSize={10}>
                  {order.accepted ? 'Accepted' : 'Pending Acceptance'}
                </Text>
              </Box>
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
            </Box>
          </Box>
          <Box>
            <Text
              marginTop="mid"
              marginBottom="pad"
              variant="regular"
              fontSize={15}
              color="primary">
              Supplier Details
            </Text>
            <Box>
              {order.supplier ? (
                Object.entries(order.supplier)
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
                        marginRight="m"
                        color="primary">
                        {v[0]}
                      </Text>
                      <Text variant="medium" style={{ color: '#474A56' }}>
                        {typeof v[1] !== typeof {} ? v[1]?.toString() : ''}
                      </Text>
                    </Box>
                  ))
              ) : (
                <Box paddingVertical="l" alignItems="center">
                  <Text variant="medium" color="primary">
                    No details available for this category
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
          <Box>
            <Text
              marginTop="mid"
              marginBottom="pad"
              variant="regular"
              fontSize={15}
              color="primary">
              Shipping Documentation
            </Text>
            {docLoading && (
              <Box paddingVertical="l" alignItems="center">
                <Chase size={20} color={primary} />
              </Box>
            )}
            <Box marginBottom="l">
              {shippingDocs.map(ss => (
                <Box marginBottom="m" key={ss.shippingDocsId}>
                  <FileCard
                    title="Shiiping Document"
                    fileName={ss.documentName}
                  />
                </Box>
              ))}
              {!shippingDocs.length && !docLoading && (
                <Box paddingVertical="l">
                  <Text variant="regular" color="primary" textAlign="center">
                    No document available for this order
                  </Text>
                </Box>
              )}
              {/* <Box>
                <FilePicker
                  label="Purchase Order"
                  uploadText="Upload Purchase Order"
                />
              </Box> */}
            </Box>
          </Box>
          <Box>
            <Text
              marginTop="mid"
              marginBottom="pad"
              variant="regular"
              fontSize={15}
              color="primary">
              Shipping Detail
            </Text>
            <Box>
              {order.shipping ? (
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
                        marginRight="m"
                        opacity={0.6}
                        color="primary">
                        {v[0]}
                      </Text>
                      <Text variant="medium" style={{ color: '#474A56' }}>
                        {v[1]?.toString()}
                      </Text>
                    </Box>
                  ))
              ) : (
                <Box paddingVertical="l" alignItems="center">
                  <Text variant="medium" color="primary">
                    No details available for this category
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
          {/* <Box>
            <Text
              marginTop="mid"
              marginBottom="pad"
              variant="regular"
              fontSize={15}
              color="primary">
              Order Queries
            </Text>
            <Box>
              {values.map(v => (
                <Box
                  key={Math.floor(Math.random() * 100000000 + 1).toString()}
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
                    color="primary">
                    {v.type}
                  </Text>
                  <Text variant="medium" style={{ color: '#474A56' }}>
                    {v.value}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box> */}
        </ScrollView>
      </Box>
      <Box marginVertical="pad" flexDirection="row" paddingHorizontal="l">
        <Box marginRight="mid" flex={1}>
          <TouchableOpacity>
            <Box
              height={31}
              borderRadius={6}
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: '#E05948' }}>
              <Text variant="regular" fontSize={12} color="white">
                Query
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
        <Box marginRight="mid" flex={1}>
          <TouchableOpacity>
            <Box
              height={31}
              borderWidth={1}
              borderColor="primary"
              borderRadius={6}
              backgroundColor="white"
              justifyContent="center"
              alignItems="center">
              <Text variant="regular" fontSize={12} color="primary">
                Accept
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
        <Box flex={1}>
          <TouchableOpacity>
            <Box
              height={31}
              borderRadius={6}
              style={{ backgroundColor: '#29B41C' }}
              justifyContent="center"
              alignItems="center">
              <Text variant="regular" fontSize={12} color="white">
                Download
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default OrderReportScreen;
