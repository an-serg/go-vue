// Цвета кнопки
export interface ButtonColors {
  bg: string
  text: string
  hoverBg: string
}

// Цвета карточки
export interface CardColors {
  bg: string
  text: string
  title: string
  icon: string
  hoverBg: string
}

// Цвета текста на странице
export interface TextColors {
  main: string      // заголовок
  subtitle: string  // подзаголовок
  body: string      // описание
}

export interface InputColors {
  bg: string
  border: string
  focusBorder: string
  text: string
  placeholder: string
  error: string
}

export interface StatusColors {
  error: string
  errorFocus: string
  success: string
  successFocus: string
  info: string
  infoFocus: string
}