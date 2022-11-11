import * as ViewletFindWidget from './ViewletFindWidget.js'

// prettier-ignore
export const Commands = {
  focusNext: ViewletFindWidget.focusNext,
  focusPrevious: ViewletFindWidget.focusPrevious,
  handleInput: ViewletFindWidget.handleInput,
}

export const Css = [
  '/css/parts/ViewletFindWidget.css',
  '/css/parts/IconButton.css',
]

export * from './ViewletFindWidget.js'
