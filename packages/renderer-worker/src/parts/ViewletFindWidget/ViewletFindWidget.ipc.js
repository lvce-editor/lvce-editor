import * as ViewletFindWidget from './ViewletFindWidget.js'

export const name = 'FindWidget'

// prettier-ignore
export const Commands = {
  focusNext: ViewletFindWidget.focusNext,
  focusPrevious: ViewletFindWidget.focusPrevious,
  handleInput: ViewletFindWidget.handleInput,
}

export * from './ViewletFindWidgetCss.js'
export * from './ViewletFindWidget.js'
