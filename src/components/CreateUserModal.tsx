import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BottomSheet from './BottomSheet';
import Box from './Box';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Text from './Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Input from './Input';
import { businessUnits, UserTypes } from '@/utils/helpers';
import Dropdown from './DropDown';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/utils/theme';
import CheckBox from './CheckBox';
import Button from './Button';

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    userName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    phoneNumber: yup.string().required(),
    userType: yup.string().required(),
  })
  .required();

const userTypeData = UserTypes.map(u => ({
  title: u.title,
  value: u.annotation,
  key: u.annotation,
}));

interface Props {
  visible: boolean;
  closeModal: () => void;
  refetch: () => void;
  userType?: number;
}

const CreateUserModal = ({ visible, closeModal, userType }: Props) => {
  const theme = useTheme<Theme>();
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);

  const {
    control,
    // handleSubmit,
    formState: { errors, defaultValues },
    // getValues,
    reset,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      phoneNumber: '',
      userType: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!visible) {
      reset();
      setSelectedTypes([]);
    }
  }, [visible, reset]);

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
                Create{' '}
                {userType
                  ? userTypeData.find(ff => ff.value === userType)?.title
                  : 'User'}
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
                            | 'userName'
                            | 'firstName'
                            | 'lastName'
                            | 'email'
                            | 'phoneNumber'
                            | 'userType'
                            | 'password'
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
                                  | 'userName'
                                  | 'firstName'
                                  | 'lastName'
                                  | 'email'
                                  | 'phoneNumber'
                                  | 'userType'
                                  | 'password'
                              ]?.message
                            }
                            borderColor="primary"
                            labelColor="primary"
                          />
                        )}
                      />
                    </Box>
                  ))}
              {userType ? (
                <Box paddingBottom="m">
                  <Text variant="regular" color="primary">
                    User Type -{' '}
                    {userTypeData.find(ff => ff.value === userType)?.title}
                  </Text>
                </Box>
              ) : (
                <Box marginBottom="m">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="userType"
                    render={({ field: { onChange } }) => (
                      <Dropdown
                        label="USERTYPE"
                        height={50}
                        data={userTypeData}
                        displayText="USERTYPE"
                        labelColor="primary"
                        onSelect={v => onChange(v)}
                        selectorContainerProps={{
                          paddingVertical: 'm',
                        }}
                        error={errors.userType?.message}
                        style={{
                          borderColor: theme.colors.primary,
                        }}
                      />
                    )}
                  />
                </Box>
              )}
              <Text variant="regular" color="primary">
                Select business unit(s)
              </Text>
              <Box flexDirection="row" flexWrap="wrap" alignItems="center">
                {businessUnits.map(u => (
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    marginRight="m"
                    key={u.annotation}
                    marginBottom="m">
                    <CheckBox
                      value={selectedTypes.includes(u.annotation)}
                      onPress={() =>
                        selectedTypes.includes(u.annotation)
                          ? setSelectedTypes(
                              selectedTypes.filter(ss => ss !== u.annotation),
                            )
                          : setSelectedTypes([...selectedTypes, u.annotation])
                      }
                    />
                    <Text variant="regular" color="primary" marginLeft="s">
                      {u.title}
                    </Text>
                  </Box>
                ))}
              </Box>
              <Box paddingVertical="pad">
                <Button
                  onPress={() => {}}
                  style={{
                    backgroundColor: '#4281FF',
                  }}>
                  <Text variant="medium" marginLeft="s" color="white">
                    Add User
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

export default CreateUserModal;
