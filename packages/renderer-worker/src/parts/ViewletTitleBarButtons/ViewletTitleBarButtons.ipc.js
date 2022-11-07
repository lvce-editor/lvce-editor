import * as ViewletTitleBarButtons from './ViewletTitleBarButtons.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

// prettier-ignore
const Imports = {
  HandleClickClose: () => import('./ViewletTitleBarButtonsHandleClickClose.js'),
  HandleClickMinimize: () => import('./ViewletTitleBarButtonsHandleClickMinimize.js'),
  HandleClickToggleMaximize: () => import('./ViewletTitleBarButtonsHandleClickToggleMaximize.js'),
}

// prettier-ignore
export const Commands = {
  handleClickClose: LazyCommand.create(ViewletTitleBarButtons.name, Imports.HandleClickClose, 'handleClickClose'),
  handleClickMinimize: LazyCommand.create(ViewletTitleBarButtons.name, Imports.HandleClickMinimize, 'handleClickMinimize'),
  handleClickToggleMaximize: LazyCommand.create(ViewletTitleBarButtons.name, Imports.HandleClickToggleMaximize, 'handleClickToggleMaximize'),
}

export const Css = '/css/parts/ViewletTitleBarButtons.css'

export * from './ViewletTitleBarButtons.js'
