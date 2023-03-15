import * as ViewletSourceControl from './ViewletSourceControl.js'

export const name = 'Source Control'

// prettier-ignore
export const Commands = {
  acceptInput: ViewletSourceControl.acceptInput,
  handleClick: ViewletSourceControl.handleClick,
  handleClickAdd: ViewletSourceControl.handleClickAdd,
  handleClickDiscard: ViewletSourceControl.handleClickDiscard,
  handleClickRestore: ViewletSourceControl.handleClickRestore,
  handleInput: ViewletSourceControl.handleInput,
  handleMouseOver: ViewletSourceControl.handleMouseOver,
}

export const LazyCommands = {
  handleContextMenu: () => import('./ViewletSourceControlHandleContextMenu.js'),
}

export * from './ViewletSourceControl.js'
export * from './ViewletSourceControlActions.js'
export * from './ViewletSourceControlCss.js'
