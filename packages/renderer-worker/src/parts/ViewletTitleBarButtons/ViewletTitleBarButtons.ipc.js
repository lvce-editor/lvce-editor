// prettier-ignore
export const Commands = {}

// prettier-ignore
export const LazyCommands={
  handleClickClose: () => import('./ViewletTitleBarButtonsHandleClickClose.js'),
  handleClickMinimize: () => import('./ViewletTitleBarButtonsHandleClickMinimize.js'),
  handleClickToggleMaximize: () => import('./ViewletTitleBarButtonsHandleClickToggleMaximize.js'),
}

export const Css = '/css/parts/ViewletTitleBarButtons.css'

export * from './ViewletTitleBarButtons.js'
