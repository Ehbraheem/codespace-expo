import Box from '@/components/Box';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Text from '@/components/Text';
import { useSignInMutation } from '@/state/services/user.service';
import { Theme } from '@/utils/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { setCredentials } from '@/state/reducers/user.reducer';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import axios from 'axios';
// import { getBaseUrl } from '@/utils/helpers';

const schema = yup
  .object({
    email: yup.string().email().max(255).required('Email is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

const SignInScreen = () => {
  const [secure, setSecure] = useState(true);
  const theme = useTheme<Theme>();
  const { foreground } = theme.colors;
  const { m } = theme.spacing;
  const dispatch = useDispatch();
  const [signin, { isLoading, data, error }] = useSignInMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (cred: any) => {
    signin(cred);
    // axios
    //   .post(getBaseUrl() + '/authenticate/signin', cred)
    //   .then(r => console.log(r))
    //   .catch(e => console.log('axios error', e));
    // axios
    //   .get('https://jsonplaceholder.typicode.com/todos/1', {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //   .then(rr => console.log(rr))
    //   .catch(e => console.log('axios err:', e));
  };

  useEffect(() => {
    if (data) {
      console.log('data', JSON.stringify(data.data));
      if (data == null) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2:
            'Something went wrong authenticating. Kindly check credentials and try again',
        });
        return;
      }
      dispatch(
        setCredentials({
          user: data.data,
        }),
      );
    }

    if (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          (error as any)?.error ||
          (error as any)?.data?.message ||
          'Something went wrong',
      });
    }
  }, [error, data, dispatch]);

  return (
    <ImageBackground
      resizeMethod="scale"
      resizeMode="cover"
      style={{ height: Dimensions.get('window').height }}
      source={require('@/assets/images/sign-in.png')}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <Box flex={1} height={Dimensions.get('window').height}>
            <Box height={194} justifyContent="center" alignItems="center">
              <Image source={require('@/assets/images/logo.png')} />
            </Box>
            <Box
              flex={1}
              backgroundColor="primary"
              borderTopLeftRadius={15}
              borderTopRightRadius={15}
              paddingHorizontal="pad"
              paddingTop="xl">
              <Text
                variant="semibold"
                color="white"
                fontSize={28}
                marginBottom="xl"
                textAlign="center">
                Sign in
              </Text>
              <Box flex={1} justifyContent="space-between">
                <Box>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Enter your email address"
                        label="Email"
                        value={value}
                        onChangeText={v => onChange(v.trim())}
                        error={errors.email?.message}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Enter your password"
                        label="Password"
                        secureTextEntry={secure}
                        rightComponent={
                          <TouchableOpacity
                            onPress={() => setSecure(!secure)}
                            style={{ marginLeft: m }}>
                            <Feather name="eye" size={18} color={foreground} />
                          </TouchableOpacity>
                        }
                        containerProps={{
                          marginBottom: 'm',
                        }}
                        value={value}
                        onChangeText={v => onChange(v)}
                        error={errors.password?.message}
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={async () =>
                      await Linking.openURL(
                        'https://fms.dev.dangote.islands.digital/auth/forgot-password',
                      )
                    }>
                    <Text variant="regular" fontStyle="italic" color="white">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </Box>
                <Box marginBottom="xxl">
                  <Button
                    displayText="Sign In"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignInScreen;
