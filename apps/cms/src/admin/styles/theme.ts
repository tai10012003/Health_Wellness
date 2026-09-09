import { wellnestAdminTokens } from './tokens';

const { colors, fonts, fontSizes } = wellnestAdminTokens;

export const wellnestAdminTheme = {
  light: {
    colors: {
      primary100: colors.brandGreenSoft,
      primary200: '#c9ddd7',
      primary500: colors.brandGreen,
      primary600: colors.brandGreen,
      primary700: colors.brandGreenDark,
      buttonPrimary500: colors.brandGreen,
      buttonPrimary600: colors.brandGreenDark,
      secondary100: '#f8efd9',
      secondary500: colors.brandGold,
      secondary600: '#aa7c28',
      neutral0: colors.surface,
      neutral100: colors.brandCream,
      neutral150: '#efebe3',
      neutral200: colors.borderSoft,
      neutral500: colors.textMuted,
      neutral600: colors.textMuted,
      neutral700: '#30413a',
      neutral800: colors.textStrong,
      neutral900: '#0c1814'
    },
    fontSizes,
    fonts
  },
  dark: {
    colors: {
      primary100: '#cfe0dc',
      primary200: '#a7cbc2',
      primary500: '#4fa58f',
      primary600: '#62b49f',
      primary700: '#8ccbbc',
      buttonPrimary500: colors.brandGreen,
      buttonPrimary600: '#1a7564',
      secondary100: '#f8efd9',
      secondary500: colors.brandGold,
      secondary600: '#e0b969',
      neutral0: '#0c1814',
      neutral100: '#11211c',
      neutral150: '#172b25',
      neutral200: '#243c35',
      neutral500: '#a8b5b0',
      neutral600: '#c5cfcb',
      neutral700: '#dde5e2',
      neutral800: '#f4f7f5',
      neutral900: '#ffffff'
    },
    fontSizes,
    fonts
  }
} as const;
