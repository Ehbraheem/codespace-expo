import { Theme } from '@/utils/theme';
import { BoxProps, useTheme } from '@shopify/restyle';
import React, { ReactNode } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import Box from './Box';
import Text from './Text';

interface Props {
  containerProps?: BoxProps<Theme>;
  onPress?: () => void;
  buttonProps?: BoxProps<Theme>;
  displayText?: string;
  children?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button = ({
  containerProps,
  onPress,
  buttonProps,
  displayText,
  children,
  loading,
  style,
  disabled,
}: Props) => {
  const theme = useTheme<Theme>();
  const { white } = theme.colors;

  return (
    <Box width="100%" {...containerProps}>
      <TouchableOpacity disabled={disabled || loading} onPress={onPress}>
        <Box
          height={50}
          backgroundColor="secondary"
          flexDirection="row"
          justifyContent="center"
          borderRadius={6}
          alignItems="center"
          {...buttonProps}
          style={{ ...style }}>
          {loading && (
            <Chase color={white} style={{ marginRight: 5 }} size={16} />
          )}
          <Text variant="medium" color="white" fontSize={16}>
            {displayText}
          </Text>
          {children}
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default Button;
