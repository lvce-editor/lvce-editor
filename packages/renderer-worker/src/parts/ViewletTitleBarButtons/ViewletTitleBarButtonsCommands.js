import * as GlobalEventType from '../GlobalEventType/GlobalEventType.js'
import * as ViewletTitleBarButtons from './ViewletTitleBarButtons.js'

export const Commands = {}

// prettier-ignore
export const LazyCommands = {
  handleClickClose: () => import('./ViewletTitleBarButtonsHandleClickClose.js'),
  handleClickMinimize: () => import('./ViewletTitleBarButtonsHandleClickMinimize.js'),
  handleClickToggleMaximize: () => import('./ViewletTitleBarButtonsHandleClickToggleMaximize.js'),
}

export const Events = {
  [GlobalEventType.HandleMaximized]: ViewletTitleBarButtons.handleWindowDidMaximize,
  [GlobalEventType.HandleUnmaximized]: ViewletTitleBarButtons.handleWindowDidUnmaximize,
  [GlobalEventType.HandleMinimized]: ViewletTitleBarButtons.handleWindowDidMinimize,
}
