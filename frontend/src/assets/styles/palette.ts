import type {
  ButtonColors,
  CardColors,
  TextColors,
  InputColors,
  StatusColors
} from '@/types/ui'

import { colors } from './colors'


// ====================
// BUTTONS
// ====================

export const greenButton: ButtonColors = {
  bg: colors.button.green.bg,
  hoverBg: colors.button.green.hover,
  text: colors.button.green.text,
}


export const pinkButton: ButtonColors = {
  bg: colors.button.pink.bg,
  hoverBg: colors.button.pink.hover,
  text: colors.button.pink.text,
}


// ====================
// CARDS
// ====================

export const greenCard: CardColors = {
  bg: colors.bg.green,
  hoverBg: colors.bg.green,
  text: colors.text.light,
  title: colors.text.light,
  icon: colors.icon.light,
}


// ====================
// TEXT
// ====================

export const greenText: TextColors = {
  main: colors.text.greenDark,
  subtitle: colors.text.muted,
  body: colors.text.muted,
}


export const pinkText: TextColors = {
  main: colors.text.pinkDark,
  subtitle: colors.text.muted,
  body: colors.text.muted,
}

// ====================
// INPUTS
// ====================
export const formInput: InputColors = {
  bg: colors.input.bg,                 // cream
  border: colors.input.border,         // greenDark
  focusBorder: colors.input.focusBorder, // greenDark (или можно другой)
  text: colors.input.text,             // greenDark
  placeholder: colors.input.placeholder, // greenDark c opacity 0.7
  error: colors.input.error,
}

// ====================
// STATUS
// ====================
export const statusColors: StatusColors = {
  error: colors.status.error,
  errorFocus: colors.status.errorFocus,
  success: colors.status.success,
  successFocus: colors.status.successFocus,
  info: colors.status.info,
  infoFocus: colors.status.infoFocus,
}

export const mainBg = colors.bg.main