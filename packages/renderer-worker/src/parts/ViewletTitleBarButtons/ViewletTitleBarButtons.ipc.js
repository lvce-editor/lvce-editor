export const name = 'TitleBarButtons'

// prettier-ignore
export const Commands = {}

// prettier-ignore
export const LazyCommands = {
  handleClickClose: () => import('./ViewletTitleBarButtonsHandleClickClose.js'),
  handleClickMinimize: () => import('./ViewletTitleBarButtonsHandleClickMinimize.js'),
  handleClickToggleMaximize: () => import('./ViewletTitleBarButtonsHandleClickToggleMaximize.js'),
}

export const Css = [
  '/css/parts/ViewletTitleBarButtons.css',
  '/css/parts/MaskIcon.css',
]

export * from './ViewletTitleBarButtons.js'
