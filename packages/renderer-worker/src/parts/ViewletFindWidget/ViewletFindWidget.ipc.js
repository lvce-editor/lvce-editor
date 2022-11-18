import * as ViewletFindWidget from './ViewletFindWidget.js'

export const name = 'FindWidget'

// prettier-ignore
export const Commands = {
  focusNext: ViewletFindWidget.focusNext,
  focusPrevious: ViewletFindWidget.focusPrevious,
  handleInput: ViewletFindWidget.handleInput,
}

export const Css = [
  '/css/parts/ViewletFindWidget.css',
  '/css/parts/IconButton.css',
  '/css/parts/MaskIcon.css',
  '/css/parts/InputBox.css',
]

export * from './ViewletFindWidget.js'
