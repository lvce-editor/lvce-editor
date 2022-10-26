import * as ViewletFindWidget from './ViewletFindWidget.js'

// prettier-ignore
export const Commands = {
  'FindWidget.focusNext': ViewletFindWidget.focusNext,
  'FindWidget.focusPrevious': ViewletFindWidget.focusPrevious,
  'FindWidget.handleInput': ViewletFindWidget.handleInput,
}

export const Css = '/css/parts/ViewletFindWidget.css'

export * from './ViewletFindWidget.js'
