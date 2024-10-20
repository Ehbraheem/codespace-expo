import Box from '@/components/Box';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ShippingCard from '@/components/ShippingCard';
import Text from '@/components/Text';
import { Theme } from '@/utils/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const SuppliersScreen = () => {
  const theme = useTheme<Theme>();
  const { white } = theme.colors;

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
        />
        <Box marginTop="l" flex={1}>
          <ScrollView>
            <ShippingCard />
            <ShippingCard shipped />
            <ShippingCard />
            <ShippingCard shipped />
            <ShippingCard />
          </ScrollView>
        </Box>
        <Box paddingVertical="pad">
          <Button
            style={{
              backgroundColor: '#4281FF',
            }}>
            <Feather name="plus" size={16} color={white} />
            <Text variant="medium" marginLeft="s" color="white">
              New Supplier
            </Text>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default SuppliersScreen;
