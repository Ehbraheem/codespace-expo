import Box from '@/components/Box';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ShipmentCard from '@/components/ShipmentCard';
import Text from '@/components/Text';
import { useGetAllShipmentsMutation } from '@/state/services/shipment.service';
import { Theme } from '@/utils/theme';
import { Shipment } from '@/utils/types';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import Feather from 'react-native-vector-icons/Feather';

const ShipmentsScreen = () => {
  const theme = useTheme<Theme>();
  const { white, primary } = theme.colors;
  const [filter, setFilter] = useState('');
  const [
    getShipments,
    {
      isLoading: shipmentsLoading,
      data: shipmentsData,
      reset: shipmentsReset,
      // error: ordersError,
    },
  ] = useGetAllShipmentsMutation();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 99;
  const filteredData = useMemo(
    () =>
      shipments.filter(ss => {
        const entries = Object.entries(ss);
        return entries.find(f =>
          f[1] ? f[1].toString().includes(filter.trim()) : false,
        );
      }),
    [shipments, filter],
  );

  useEffect(() => {
    getShipments({
      pageNumber,
      pageSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pageNumber > 1) {
      getShipments({
        pageNumber,
        pageSize,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  useEffect(() => {
    if (filteredData.length < 4 && hasNextPage) {
      setPageNumber(pageNumber + 1);
    }
  }, [filteredData, hasNextPage, pageNumber]);

  useEffect(() => {
    if (shipmentsData) {
      const o = shipmentsData as any;
      setHasNextPage(o.hasNextPage);
      setPageNumber(o.pageIndex);
      setShipments([...shipments, ...o.items]);
      shipmentsReset();
    }
  }, [shipmentsData, shipmentsReset, shipments]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} padding="l">
        <Input
          leftComponent={
            <Feather
              name="search"
              size={20}
              style={{ marginRight: 12 }}
              color="#000"
            />
          }
          placeholder="Search"
          value={filter}
          onChangeText={v => setFilter(v)}
        />
        <Box marginTop="l" flex={1}>
          {shipmentsLoading && (
            <Box paddingVertical="l" alignItems="center">
              <Chase size={20} color={primary} />
            </Box>
          )}
          <FlatList
            showsVerticalScrollIndicator={true}
            data={filteredData}
            onEndReachedThreshold={0.3}
            keyExtractor={({ id }) => id!?.toString()}
            renderItem={({ item: shipment }) => (
              <ShipmentCard shipment={shipment} />
            )}
            onEndReached={() => {
              if (hasNextPage && !shipmentsLoading) {
                setPageNumber(pageNumber + 1);
              }
            }}
          />
        </Box>
        <Box paddingVertical="pad">
          <Button
            style={{
              backgroundColor: '#4281FF',
            }}>
            <Feather name="plus" size={16} color={white} />
            <Text variant="medium" marginLeft="s" color="white">
              New Shipment
            </Text>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default ShipmentsScreen;
