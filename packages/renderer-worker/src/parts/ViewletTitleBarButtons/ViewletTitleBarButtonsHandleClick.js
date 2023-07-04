import * as ViewletTitleBarButtonsHandleClickClose from './ViewletTitleBarButtonsHandleClickClose.js'
import * as ViewletTitleBarButtonsHandleClickMinimize from './ViewletTitleBarButtonsHandleClickMinimize.js'
import * as ViewletTitleBarButtonsHandleClickToggleMaximize from './ViewletTitleBarButtonsHandleClickToggleMaximize.js'

export const handleClick = (state, className) => {
  if (className.includes('Minimize')) {
    return ViewletTitleBarButtonsHandleClickMinimize.handleClickMinimize(state)
  }
  if (className.includes('Maximize') || className.includes('Restore')) {
    return ViewletTitleBarButtonsHandleClickToggleMaximize.handleClickToggleMaximize(state)
  }
  if (className.includes('Close')) {
    return ViewletTitleBarButtonsHandleClickClose.handleClickClose(state)
  }
  return state
}
