const baseColors = {
  cream: '#FDF6E6',

  green: '#AFBA90',
  greenDark: '#585528',
  greenHover: '#E1EEBA',

  pink: '#B97D7D',
  pinkDark: '#743F3B',
  pinkHover: '#EFA0A0',

  error: '#B85C5C',
  errorFocus: '#9B4A4A',

  success: '#4CAF50',
  successFocus: '#3D8B40',

  info: '#3B82F6',
  infoFocus: '#2563EB',

  mutedGreenDark: 'rgba(88, 85, 40, 0.7)',
} as const


export const colors = {
  bg: {
    main: baseColors.cream,
    green: baseColors.green,
    pink: baseColors.pink,
  },

  text: {
    greenDark: baseColors.greenDark,
    pinkDark: baseColors.pinkDark,
    light: baseColors.cream,
    muted: baseColors.mutedGreenDark,   // теперь ссылаемся на константу
  },

  button: {
    green: {
      bg: baseColors.green,
      hover: baseColors.greenHover,
      text: baseColors.greenDark,
    },

    pink: {
      bg: baseColors.pink,
      hover: baseColors.pinkHover,
      text: baseColors.cream,
    },
  },

  input: {
    bg: baseColors.cream,               // фон полей
    border: baseColors.greenDark,       // рамка
    focusBorder: baseColors.greenDark,  // рамка при фокусе (можно оставить greenDark)
    text: baseColors.greenDark,         // вводимый текст
    placeholder: baseColors.mutedGreenDark, // placeholder с opacity 0.7
    error: baseColors.error,
  },

  icon: {
    dark: baseColors.greenDark,
    light: baseColors.cream,
  },

  status: {
    error: baseColors.error,
    errorFocus: baseColors.errorFocus,
    success: baseColors.success,
    successFocus: baseColors.successFocus,
    info: baseColors.info,
    infoFocus: baseColors.infoFocus,
  },
} as const