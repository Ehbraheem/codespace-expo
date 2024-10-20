import React, { ReactNode, useState } from 'react';
import { Dimensions, Pressable, ScrollView, ViewStyle } from 'react-native';
import Text from './Text';
import Box from './Box';
import Entypo from 'react-native-vector-icons/Entypo';
import { BoxProps, useTheme, ColorProps } from '@shopify/restyle';
import { Theme } from '@/utils/theme';
import BottomSheet from './BottomSheet';

interface Props {
  displayText?: string;
  data?: { title: string; value: any; key?: any }[];
  children?: ReactNode;
  onSelect?: (value: any) => void;
  style?: ViewStyle;
  height?: number;
  color?: string;
  defaultValue?: string;
  label?: string;
  customElement?: (props: { onPress: () => void }) => ReactNode;
  selectorContainerProps?: BoxProps<Theme>;
  error?: string;
  labelColor?: ColorProps<Theme>['color'];
}

const Dropdown = ({
  displayText,
  data,
  children,
  onSelect,
  style,
  color,
  defaultValue,
  height,
  label,
  customElement,
  selectorContainerProps,
  error,
  labelColor,
}: Props) => {
  const theme = useTheme<Theme>();
  const [active, setActive] = useState(false);
  const [display, setDisplay] = useState('');
  const [colorSelection, setColorSelection] = useState(false);
  const { foreground, primary } = theme.colors;

  const handleSelection = (value: any) => {
    onSelect && onSelect(value);
    setColorSelection(true);
  };

  return (
    <Box position="relative">
      {label && (
        <Text variant="regular" color={labelColor || 'label'} marginBottom="xs">
          {label}
        </Text>
      )}
      {customElement ? (
        customElement({ onPress: () => setActive(!active) })
      ) : (
        <Pressable onPress={() => setActive(!active)}>
          <Box
            backgroundColor="background"
            borderRadius={10}
            borderWidth={1}
            borderColor="border"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            height={height || 40}
            style={style}>
            <Text
              variant="regular"
              fontSize={14}
              paddingHorizontal="m"
              style={{
                color: color || colorSelection ? primary : foreground,
              }}>
              {displayText}{' '}
              {display
                ? `- ${
                    display.length > 20
                      ? display.substring(0, 19) + '...'
                      : display
                  }`
                : defaultValue
                ? `- ${defaultValue}`
                : ''}
            </Text>
            <Entypo
              name="chevron-thin-down"
              color={foreground}
              size={20}
              style={{ marginRight: 15 }}
            />
          </Box>
        </Pressable>
      )}
      {error && (
        <Text variant="medium" fontSize={10} style={{ color: 'red' }}>
          {error}
        </Text>
      )}
      <BottomSheet isVisible={active} closeModal={() => setActive(false)}>
        <Box
          paddingVertical="l"
          maxHeight={Dimensions.get('window').height * 0.75}>
          <ScrollView>
            {data &&
              data.map(d => (
                <Pressable
                  key={d.key || d.title}
                  onPress={() => {
                    setActive(false);
                    setDisplay(d.title);
                    handleSelection(d.value);
                  }}>
                  <Box
                    paddingVertical="s"
                    paddingHorizontal="m"
                    {...selectorContainerProps}>
                    <Text variant="regular" fontSize={16} color="foreground">
                      {d.title}
                    </Text>
                  </Box>
                </Pressable>
              ))}
          </ScrollView>
        </Box>
        {children}
      </BottomSheet>
    </Box>
  );
};

export default Dropdown;
