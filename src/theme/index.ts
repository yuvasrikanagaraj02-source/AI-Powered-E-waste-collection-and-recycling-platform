export const colors = {
  primary: '#2E7D32', // Deep green
  primaryLight: '#60AD5E',
  primaryDark: '#005005',
  secondary: '#81C784',
  background: '#F1F8E9',
  surface: '#FFFFFF',
  text: '#212121',
  textLight: '#757575',
  error: '#B00020',
  success: '#4CAF50',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  header: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  title: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    color: colors.textLight,
  },
};
