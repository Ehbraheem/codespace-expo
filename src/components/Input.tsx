import { Theme } from '@/utils/theme';
import { BoxProps, ColorProps, useTheme } from '@shopify/restyle';
import React, { ReactNode } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import Box from './Box';
import Text from './Text';

interface Props extends TextInputProps {
  label?: string;
  containerProps?: BoxProps<Theme>;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  error?: string;
  labelColor?: ColorProps<Theme>['color'];
  borderColor?: ColorProps<Theme>['color'];
}

const Input = ({
  label,
  containerProps,
  leftComponent,
  rightComponent,
  error,
  labelColor,
  borderColor,
  ...props
}: Props) => {
  const theme = useTheme<Theme>();
  const { border, foreground } = theme.colors;

  return (
    <Box marginBottom="l" {...containerProps}>
      {label && (
        <Text variant="regular" color={labelColor || 'label'} marginBottom="xs">
          {label}
        </Text>
      )}
      <Box
        backgroundColor="background"
        borderWidth={1}
        borderColor={borderColor || 'border'}
        borderRadius={6}
        height={50}
        flexDirection="row"
        paddingHorizontal="m"
        alignItems="center">
        {leftComponent}
        <TextInput
          placeholderTextColor={border}
          style={{
            flex: 1,
            height: '100%',
            fontFamily: 'BRFirma-Regular',
            color: foreground,
          }}
          {...props}
        />
        {rightComponent}
      </Box>
      {error && (
        <Text
          variant="medium"
          fontSize={10}
          style={{ color: 'red' }}
          marginTop="xs">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default Input;
