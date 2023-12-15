import { createTheme } from '@shopify/restyle';
// import { addAlpha } from '../utils/helpers';

const palette = {
  //default colors
  blue: '#03225E',
  lightblue: '#042A75',
  white: '#FFFFFF',
  black: '#000000',
  secondary: '#EC1B2E',
  transparent: 'transparent',
  border: '#C8D1E1',
  //light theme colors
  bg_dark: '#000000',
  forground_dark: '#FFFFFF',
  label_light: '#D4D7E1',
  // dark theme colors
  bg_light: '#FFFFFF',
  foreground_light: '#000000',
  danger: '#A50000',
  success: '#1B9863',
};

export const theme = createTheme({
  colors: {
    background: palette.bg_light,
    foreground: palette.black,
    primary: palette.blue,
    lightprimary: palette.lightblue,
    secondary: palette.secondary,
    white: palette.white,
    black: palette.black,
    transparent: palette.transparent,
    border: palette.border,
    success: palette.success,
    danger: palette.danger,
    label: palette.label_light,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
    xxl: 80,
    pad: 20,
    mid: 12,
  },
  textVariants: {
    bold: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'BRFirma-Bold',
    },
    semibold: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'BRFirma-SemiBold',
    },
    medium: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'BRFirma-Medium',
    },
    regular: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'BRFirma-Regular',
    },
    light: {
      fontSize: 14,
      color: 'foreground',
      fontFamily: 'BRFirma-Light',
    },
  },
  breakpoints: {},
});

export type Theme = typeof theme;

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.bg_light,
    foreground: palette.black,
  },
};
export default theme;
