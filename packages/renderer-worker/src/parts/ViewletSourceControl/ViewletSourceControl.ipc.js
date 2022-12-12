import * as ViewletSourceControl from './ViewletSourceControl.js'

export const name = 'Source Control'

// prettier-ignore
export const Commands = {
  acceptInput: ViewletSourceControl.acceptInput,
  handleMouseOver: ViewletSourceControl.handleMouseOver,
  handleContextMenu: ViewletSourceControl.handleContextMenu,
  handleClick: ViewletSourceControl.handleClick,
  handleClickAdd: ViewletSourceControl.handleClickAdd,
  handleClickDiscard: ViewletSourceControl.handleClickDiscard,
  handleClickRestore: ViewletSourceControl.handleClickRestore,
  handleInput: ViewletSourceControl.handleInput,
}

export const Css = [
  '/css/parts/InputBox.css',
  '/css/parts/TreeItem.css',
  '/css/parts/Label.css',
  '/css/parts/IconButton.css',
  '/css/parts/MaskIcon.css',
  '/css/parts/ViewletSourceControl.css',
]

export * from './ViewletSourceControl.js'
