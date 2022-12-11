import * as ViewletSourceControl from './ViewletSourceControl.js'

export const name = 'Source Control'

// prettier-ignore
export const Commands = {
  acceptInput: ViewletSourceControl.acceptInput,
  handleMouseOver: ViewletSourceControl.handleMouseOver,
  handleContextMenu: ViewletSourceControl.handleContextMenu,
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
