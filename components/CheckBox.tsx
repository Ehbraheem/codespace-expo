import { Theme } from '@/utils/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Box from './Box';

interface Props {
  size?: number;
  value?: boolean;
  onPress?: () => void;
  color?: string;
  checkColor?: { true: string; false: string };
  checkSize?: number;
}

const CheckBox = ({
  size = 20,
  value = false,
  color,
  checkColor,
  onPress,
  checkSize = 14,
}: Props) => {
  const theme = useTheme<Theme>();

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        height={size}
        width={size}
        borderRadius={6}
        borderWidth={1}
        justifyContent="center"
        alignItems="center"
        style={{
          backgroundColor: value
            ? color || theme.colors.primary
            : theme.colors.white,
          borderColor: color || theme.colors.primary,
        }}>
        <Feather
          name="check"
          color={
            value
              ? checkColor?.true || theme.colors.white
              : checkColor?.false || theme.colors.primary
          }
          size={checkSize}
        />
      </Box>
    </TouchableOpacity>
  );
};

export default CheckBox;
