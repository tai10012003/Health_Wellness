export const wellnestAdminTokens = {
  colors: {
    brandGreen: '#115f50',
    brandGreenDark: '#0d493e',
    brandGreenSoft: '#dfece8',
    brandCream: '#f7f4ee',
    brandGold: '#c99a3e',
    textStrong: '#17231f',
    textMuted: '#64736e',
    borderSoft: '#d8dfda',
    surface: '#ffffff'
  },
  fonts: {
    body: 'Inter, Arial, sans-serif',
    heading: 'Inter, Arial, sans-serif',
    mono: 'SFMono-Regular, Consolas, Liberation Mono, monospace'
  },
  fontSizes: {
    xs: '1.2rem',
    sm: '1.3rem',
    md: '1.4rem',
    lg: '1.6rem',
    xl: '2rem',
    h1: '3.2rem'
  }
} as const;

export type WellnestAdminTokens = typeof wellnestAdminTokens;
