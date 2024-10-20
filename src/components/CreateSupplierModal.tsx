import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import { useTheme } from '@shopify/restyle';
// import { Theme } from '@/utils/theme';
import BottomSheet from './BottomSheet';
import Box from './Box';
import Text from './Text';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from './Button';
import Input from './Input';
import { useCreateSupplierMutation } from '@/state/services/supplier.service';
import Toast from 'react-native-toast-message';

const schema = yup
  .object({
    name: yup.string().required(),
    address: yup.string().required(),
    country: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().required(),
  })
  .required();

interface Props {
  visible: boolean;
  closeModal: () => void;
  refetch: () => void;
}

const CreateSupplierModal = ({ visible, closeModal, refetch }: Props) => {
  // const theme = useTheme<Theme>();
  const [
    createSupplier,
    {
      isLoading: supplierLoading,
      data: supplierData,
      error: supplierError,
      reset: supplierReset,
    },
  ] = useCreateSupplierMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, defaultValues },
    // getValues,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      address: '',
      country: '',
      email: '',
      phone: '',
    },
    resolver: yupResolver(schema),
  });

  const submit = (cred: any) => {
    createSupplier({
      ...cred,
    });
  };

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  useEffect(() => {
    if (supplierData) {
      closeModal();
      refetch();
      supplierReset();
    }
    if (supplierError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          (supplierError as any)?.error ||
          (supplierError as any)?.data?.message ||
          'Something went wrong',
      });
      supplierReset();
    }
  }, [supplierData, supplierError, refetch, closeModal, supplierReset]);

  return (
    <BottomSheet isVisible={visible} closeModal={closeModal}>
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
              <Text variant="medium" fontSize={18} style={{ color: '#474A56' }}>
                Create Supplier
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <MaterialIcons name="close" size={20} color="#C8D1E1" />
              </TouchableOpacity>
            </Box>
          </Box>
          <Box paddingBottom="xl" marginTop="l" flex={1}>
            <ScrollView>
              {defaultValues &&
                Object.entries(defaultValues)
                  .filter(f => !f[0].includes('lastModified'))
                  .filter(d => d[0] !== 'userType')
                  .map(dd => (
                    <Box key={dd[0]}>
                      <Controller
                        control={control}
                        rules={{
                          required: true,
                        }}
                        name={
                          dd[0] as
                            | 'name'
                            | 'address'
                            | 'phone'
                            | 'email'
                            | 'country'
                        }
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder={dd[0].toUpperCase()}
                            label={dd[0].toUpperCase()}
                            value={value}
                            onChangeText={v => onChange(v)}
                            error={
                              errors[
                                dd[0] as
                                  | 'name'
                                  | 'address'
                                  | 'phone'
                                  | 'email'
                                  | 'country'
                              ]?.message
                            }
                            borderColor="primary"
                            labelColor="primary"
                          />
                        )}
                      />
                    </Box>
                  ))}
              <Box paddingVertical="pad">
                <Button
                  loading={supplierLoading}
                  onPress={handleSubmit(submit)}
                  style={{
                    backgroundColor: '#4281FF',
                  }}>
                  <Text variant="medium" marginLeft="s" color="white">
                    Add Supplier
                  </Text>
                </Button>
              </Box>
            </ScrollView>
          </Box>
        </Box>
      </Box>
    </BottomSheet>
  );
};

export default CreateSupplierModal;
