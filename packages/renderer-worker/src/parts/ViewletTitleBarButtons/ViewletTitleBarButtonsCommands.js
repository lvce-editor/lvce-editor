export const Commands = {}

// prettier-ignore
export const LazyCommands = {
  handleClickClose: () => import('./ViewletTitleBarButtonsHandleClickClose.js'),
  handleClickMinimize: () => import('./ViewletTitleBarButtonsHandleClickMinimize.js'),
  handleClickToggleMaximize: () => import('./ViewletTitleBarButtonsHandleClickToggleMaximize.js'),
}
