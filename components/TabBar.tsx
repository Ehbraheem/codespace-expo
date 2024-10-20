import React, { useEffect, useMemo, useState } from 'react';
import Box from './Box';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Text from './Text';
import {
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { addAlpha, businessUnits } from '@/utils/helpers';
import BottomSheet from './BottomSheet';
import { Supplier } from '@/utils/types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useGetAllSuppliersMutation } from '@/state/services/supplier.service';
import { Chase } from 'react-native-animated-spinkit';
import Dropdown from './DropDown';
import Input from './Input';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/utils/theme';
import FilePicker from './FilePicker';
import Button from './Button';
import { DocumentPickerResponse } from 'react-native-document-picker';
import DatePicker from './DatePicker';
import { useCreateShippingMutation } from '@/state/services/shipping.service';
import Toast from 'react-native-toast-message';
import { useCreateOrderMutation } from '@/state/services/order.service';

const schema = yup
  .object({
    description: yup.string().required(),
    portOfLoading: yup.string().required(),
    orderType: yup.string().required(),
    origin: yup.string().required(),
    incoterm: yup.string().required(),
    edd: yup.string().required(),
    poNumber: yup.string().required(),
    orderSize: yup.string().required(),
    orderSizeUnit: yup.string().required(),
    portOfDischarge: yup.string().required(),
    businessUnit: yup.string().required(),
    supplierId: yup.string().required(),
  })
  .required();

const selectDocuments = [
  {
    value: 'billofLaden',
    title: 'Bill of laden',
  },
  {
    value: 'airwayBill',
    title: 'Airway bill',
  },
  {
    value: 'certificateOfOrigin',
    title: 'Certificate of Origin',
  },
  {
    value: 'sonCap',
    title: 'Son Cap',
  },
  {
    value: 'PAAR',
    title: 'PAAR',
  },
  {
    value: 'packingList',
    title: 'Packing List',
  },
  {
    value: 'commercialInvoice',
    title: 'Commercial Invoice',
  },
  {
    value: 'SGD',
    title: 'SGD',
  },
  {
    value: 'MSDS',
    title: 'MSDS',
  },
  {
    value: 'terminalReceipt',
    title: 'Terminal Receipt',
  },
  {
    value: 'shoppingReceipt',
    title: 'Shopping Receipt',
  },
  {
    value: 'terminalInvoice',
    title: 'Terminal Invoice',
  },
  {
    value: 'nafdacPermit',
    title: 'NAFDAC Permit',
  },
  {
    value: 'manufacturerCertificate',
    title: 'Manufacturer Certificate',
  },
];

const TabBar = ({ navigation, state }: BottomTabBarProps) => {
  const theme = useTheme<Theme>();
  const { primary } = theme.colors;
  const { m } = theme.spacing;
  const [visible, setVisible] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [shippingDocuments, setShippingDocuments] = useState<
    DocumentPickerResponse[][]
  >([[{ size: null, fileCopyUri: null, name: null, type: null, uri: '' }]]);
  const [documentTypes, setDocumentTypes] = useState<string[]>(['']);
  const businessUnitData = businessUnits.map(b => ({
    title: b.title,
    value: b.annotation.toString(),
  }));
  const suppliersData = useMemo(
    () =>
      suppliers.map(ss => ({
        title: ss.name!,
        value: ss.supplierId.toString(),
        key: ss.supplierId,
      })),
    [suppliers],
  );
  const orderTypeData = [
    {
      title: 'Container',
      value: 'Container',
    },
    {
      title: 'Break Bulk',
      value: 'Break Bulk',
    },
  ];
  const [
    getSuppliers,
    {
      isLoading: suppliersLoading,
      data: supplierssData,
      reset: suppliersReset,
      // error: ordersError,
    },
  ] = useGetAllSuppliersMutation();

  const [
    createShipping,
    {
      isLoading: createShippingLoading,
      error: createShippingError,
      data: createShippingData,
      reset: createShippingReset,
    },
  ] = useCreateShippingMutation();
  const [
    createOrder,
    {
      isLoading: createOrderLoading,
      error: createOrderError,
      data: createOrderData,
      reset: createOrderReset,
    },
  ] = useCreateOrderMutation();

  const routeFocused = (index: number) => {
    return index === state.index;
  };

  const handlePress = (index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    const isFocused = state.index === index;

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({
        name: state.routes[index].name,
        merge: true,
      } as any);
    }
  };

  const handleLongPress = (index: number) => {
    navigation.emit({
      type: 'tabLongPress',
      target: state.routes[index].key,
    });
  };

  const submit = (cred: any) => {
    const edd = new Date(cred.edd);
    for (const [index, doc] of shippingDocuments.entries()) {
      if (!doc[0].uri || !documentTypes[index]) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Select a document and a type to proceed',
        });
        return;
      }
    }
    createShipping({
      description: cred.description,
      destination: cred.portOfDischarge,
      edd: `${edd.getFullYear()}/${edd.getMonth()}/${edd.getDate()}`,
      incoterm: cred.incoterm,
      orderSize: cred.orderSize,
      orderSizeUnit: cred.orderSizeUnit,
      orderType: cred.orderType,
      origin: cred.origin,
      poNumber: cred.poNumber,
      portOfLoading: cred.portOfLoading,
    });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      description: '',
      portOfLoading: '',
      orderType: '',
      origin: '',
      incoterm: '',
      edd: '',
      poNumber: '',
      orderSize: '',
      orderSizeUnit: '',
      portOfDischarge: '',
      businessUnit: '',
      supplierId: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getSuppliers({
      pageNumber: 1,
      pageSize: 99,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (supplierssData) {
      const o = supplierssData as any;
      setSuppliers([...suppliers, ...o.items]);
      suppliersReset();
    }
  }, [supplierssData, suppliersReset, suppliers]);

  useEffect(() => {
    if (!visible) {
      setDocumentTypes(['']);
      setShippingDocuments([
        [{ size: null, fileCopyUri: null, name: null, type: null, uri: '' }],
      ]);
      reset();
    }
  }, [visible, reset]);

  useEffect(() => {
    if (createShippingData) {
      const bodyForm = new FormData();
      bodyForm.append('title', getValues('description'));
      bodyForm.append('supplierId', getValues('supplierId'));
      bodyForm.append('status', 'new');
      bodyForm.append('orderStatus', 0);
      bodyForm.append('buProject', getValues('businessUnit'));
      bodyForm.append('vesselId', null);
      bodyForm.append('accepted', false);
      bodyForm.append('shipping', createShippingData);
      bodyForm.append('shippingId', createShippingData);
      for (const [index, doc] of shippingDocuments.entries()) {
        if (doc[0].uri && documentTypes[index]) {
          bodyForm.append(documentTypes[index], {
            uri: doc[0].uri.replace(Platform.OS === 'ios' ? 'file://' : '', ''),
            name: doc[0].name,
            type: doc[0].type,
          } as any);
        }
      }
      createOrder(bodyForm);
      createShippingReset();
    }

    if (createShippingError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          (createShippingError as any)?.error ||
          (createShippingError as any)?.data?.message ||
          'Something went wrong',
      });
      createShippingReset();
    }
  }, [
    createShippingData,
    createShippingError,
    createShippingReset,
    getValues,
    createOrder,
    documentTypes,
    shippingDocuments,
  ]);

  useEffect(() => {
    if (createOrderData) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Order Created',
      });
      setDocumentTypes(['']);
      setShippingDocuments([
        [{ size: null, fileCopyUri: null, name: null, type: null, uri: '' }],
      ]);
      reset();
      createShippingReset();
      createOrderReset();
    }

    if (createOrderError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          (createOrderError as any)?.error ||
          (createOrderError as any)?.data?.message ||
          'Something went wrong',
      });
      createOrderReset();
      createOrderReset();
    }
  }, [
    createShippingReset,
    createOrderData,
    createOrderError,
    createOrderReset,
    reset,
  ]);

  return (
    <>
      <Box
        flexDirection="row"
        alignItems="center"
        position="relative"
        paddingHorizontal="pad"
        backgroundColor="white"
        paddingBottom={Platform.OS === 'ios' ? 'm' : undefined}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        elevation={24}>
        <Box
          flex={1.2}
          backgroundColor="white"
          flexDirection="row"
          justifyContent="space-between"
          paddingVertical="pad">
          <TouchableOpacity
            onPress={() => handlePress(0)}
            onLongPress={() => handleLongPress(0)}>
            <Box alignItems="center" height={44} justifyContent="space-between">
              <Entypo
                name="home"
                size={22}
                color={routeFocused(0) ? '#474A56' : addAlpha('#273B4A', 0.5)}
              />
              <Text
                variant="regular"
                fontSize={12}
                style={{
                  color: routeFocused(0) ? '#474A56' : addAlpha('#273B4A', 0.5),
                }}>
                Home
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress(1)}
            onLongPress={() => handleLongPress(1)}>
            <Box alignItems="center" height={44} justifyContent="space-between">
              <Entypo
                name="box"
                size={22}
                color={routeFocused(1) ? '#474A56' : addAlpha('#273B4A', 0.5)}
              />
              <Text
                variant="regular"
                fontSize={12}
                style={{
                  color: routeFocused(1) ? '#474A56' : addAlpha('#273B4A', 0.5),
                }}>
                Jobs
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
        <Box
          flex={1.5}
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: -15 }}>
          <TouchableOpacity
            disabled={suppliersLoading}
            onPress={() => setVisible(true)}
            style={{
              backgroundColor: '#FFF',
              borderRadius: 65,
              elevation: 4,
            }}>
            <Box
              height={65}
              width={65}
              borderRadius={65}
              backgroundColor="primary"
              justifyContent="center"
              alignItems="center">
              {suppliersLoading ? (
                <Chase color="#FFFFFF" size={30} />
              ) : (
                <Entypo name="plus" size={30} color="#FFFFFF" />
              )}
            </Box>
          </TouchableOpacity>
        </Box>
        <Box
          justifyContent="space-between"
          flex={1.2}
          backgroundColor="white"
          flexDirection="row"
          paddingVertical="pad">
          <TouchableOpacity
            onPress={() => handlePress(2)}
            onLongPress={() => handleLongPress(2)}>
            <Box alignItems="center" height={44} justifyContent="space-between">
              <Ionicons
                name="stats-chart"
                size={22}
                color={routeFocused(2) ? '#474A56' : addAlpha('#273B4A', 0.5)}
              />
              <Text
                variant="regular"
                fontSize={12}
                style={{
                  color: routeFocused(2) ? '#474A56' : addAlpha('#273B4A', 0.5),
                }}>
                Reports
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress(3)}
            onLongPress={() => handleLongPress(3)}>
            <Box alignItems="center" height={44} justifyContent="space-between">
              <FontAwesome
                name="user"
                size={22}
                color={routeFocused(3) ? '#474A56' : addAlpha('#273B4A', 0.5)}
              />
              <Text
                variant="regular"
                fontSize={12}
                style={{
                  color: routeFocused(3) ? '#474A56' : addAlpha('#273B4A', 0.5),
                }}>
                Agents
              </Text>
            </Box>
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
                  New Purchase order
                </Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <MaterialIcons name="close" size={20} color="#C8D1E1" />
                </TouchableOpacity>
              </Box>
            </Box>
            <Box marginTop="l" flex={1}>
              <ScrollView>
                <Box marginBottom="m">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="supplierId"
                    render={({ field: { onChange } }) => (
                      <Dropdown
                        label="Supplier"
                        height={50}
                        data={suppliersData}
                        displayText="Supplier"
                        labelColor="primary"
                        onSelect={v => onChange(v)}
                        selectorContainerProps={{
                          paddingVertical: 'm',
                        }}
                        error={errors.supplierId?.message}
                        style={{
                          borderColor: primary,
                        }}
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Description"
                        label="Description"
                        value={value}
                        onChangeText={v => onChange(v)}
                        error={errors.description?.message}
                        borderColor="primary"
                        labelColor="primary"
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="portOfLoading"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Port of loading"
                        label="Port of loading"
                        value={value}
                        onChangeText={v => onChange(v)}
                        error={errors.portOfLoading?.message}
                        borderColor="primary"
                        labelColor="primary"
                      />
                    )}
                  />
                </Box>
                <Box marginBottom="m">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="orderType"
                    render={({ field: { onChange } }) => (
                      <Dropdown
                        label="Order Type"
                        height={50}
                        data={orderTypeData}
                        displayText="Order Type"
                        labelColor="primary"
                        onSelect={v => onChange(v)}
                        selectorContainerProps={{
                          paddingVertical: 'm',
                        }}
                        error={errors.orderType?.message}
                        style={{
                          borderColor: primary,
                        }}
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="origin"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Origin"
                        label="Country of origin"
                        value={value}
                        onChangeText={v => onChange(v)}
                        error={errors.origin?.message}
                        borderColor="primary"
                        labelColor="primary"
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="incoterm"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Incoterm"
                        label="Incoterm of loading"
                        value={value}
                        onChangeText={v => onChange(v)}
                        error={errors.incoterm?.message}
                        borderColor="primary"
                        labelColor="primary"
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="poNumber"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="PO Number"
                        label="Purchase order number"
                        value={value}
                        onChangeText={v => onChange(v)}
                        error={errors.poNumber?.message}
                        borderColor="primary"
                        labelColor="primary"
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="orderSize"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Size"
                        label="Size of order/quantity"
                        value={value}
                        onChangeText={v => onChange(v)}
                        error={errors.orderSize?.message}
                        borderColor="primary"
                        labelColor="primary"
                      />
                    )}
                  />
                </Box>
                <Box marginBottom="m">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="orderSizeUnit"
                    render={({ field: { onChange } }) => (
                      <Dropdown
                        label="Order Size Unit"
                        height={50}
                        data={[
                          {
                            title: 'KG',
                            value: 'kg',
                          },
                          {
                            title: 'M3',
                            value: 'm3',
                          },
                        ]}
                        displayText="Order Size Unit"
                        labelColor="primary"
                        onSelect={v => onChange(v)}
                        selectorContainerProps={{
                          paddingVertical: 'm',
                        }}
                        error={errors.orderSizeUnit?.message}
                        style={{
                          borderColor: primary,
                        }}
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="edd"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <DatePicker
                          label="Expected delivery date"
                          value={value}
                          onChange={v => onChange(v)}
                          error={errors.edd?.message}
                          borderColor="primary"
                          labelColor="primary"
                        />
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="portOfDischarge"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Discharge"
                        label="Port of discharge"
                        value={value}
                        onChangeText={v => onChange(v)}
                        error={errors.portOfDischarge?.message}
                        borderColor="primary"
                        labelColor="primary"
                      />
                    )}
                  />
                </Box>
                <Box marginBottom="m">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="businessUnit"
                    render={({ field: { onChange } }) => (
                      <Dropdown
                        label="Business Unit"
                        height={50}
                        data={businessUnitData}
                        displayText="Business Unit"
                        labelColor="primary"
                        onSelect={v => onChange(v)}
                        selectorContainerProps={{
                          paddingVertical: 'm',
                        }}
                        error={errors.orderType?.message}
                        style={{
                          borderColor: primary,
                        }}
                      />
                    )}
                  />
                </Box>
                <Box paddingTop="m">
                  <Text marginBottom="l" variant="medium" color="primary">
                    Shipping Documents
                  </Text>
                  {shippingDocuments.map((s, i) => (
                    <Box marginBottom="m" key={i}>
                      <Dropdown
                        label="Document Type"
                        height={50}
                        data={selectDocuments}
                        displayText="Select Document Type"
                        labelColor="primary"
                        onSelect={v => {
                          setDocumentTypes([...documentTypes, v]);
                        }}
                        selectorContainerProps={{
                          paddingVertical: 'm',
                        }}
                        error={errors.orderType?.message}
                        style={{
                          borderColor: primary,
                          marginBottom: m,
                        }}
                      />
                      <FilePicker
                        file={s}
                        onSelect={file =>
                          setShippingDocuments([...shippingDocuments, file])
                        }
                        multiple={false}
                        uploadText="Select document"
                        // label="Shipping documents"
                        color={primary}
                      />
                    </Box>
                  ))}
                </Box>
                <Box flexDirection="row">
                  <Box flex={1}>
                    <Button
                      displayText="Add More"
                      style={{
                        backgroundColor: primary,
                      }}
                      onPress={() => {
                        setDocumentTypes([...documentTypes, '']);
                        setShippingDocuments([
                          ...shippingDocuments,
                          [
                            {
                              size: null,
                              fileCopyUri: null,
                              name: null,
                              type: null,
                              uri: '',
                            },
                          ],
                        ]);
                      }}
                    />
                  </Box>
                  <Box flex={1}></Box>
                </Box>
                <Box paddingVertical="m" marginBottom="xl">
                  <Button
                    displayText="Submit"
                    onPress={handleSubmit(submit)}
                    loading={createOrderLoading || createShippingLoading}
                  />
                </Box>
              </ScrollView>
            </Box>
          </Box>
        </Box>
      </BottomSheet>
    </>
  );
};

export default TabBar;
