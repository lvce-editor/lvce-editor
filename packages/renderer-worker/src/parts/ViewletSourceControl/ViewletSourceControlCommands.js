import * as ViewletSourceControl from './ViewletSourceControl.js'

// prettier-ignore
export const Commands = {
  handleInput: ViewletSourceControl.handleInput,
  handleMouseOver: ViewletSourceControl.handleMouseOver,
  handleMouseOut: ViewletSourceControl.handleMouseOut,
}

export const LazyCommands = {
  handleContextMenu: () => import('./ViewletSourceControlHandleContextMenu.js'),
  handleClick: () => import('./ViewletSourceControlHandleClick.js'),
  handleButtonClick: () => import('./ViewletSourceControlHandleButtonClick.js'),
  acceptInput: () => import('./ViewletSourceControlAcceptInput.js'),
}
