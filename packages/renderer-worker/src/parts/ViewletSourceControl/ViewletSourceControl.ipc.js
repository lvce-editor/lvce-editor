import * as ViewletSourceControl from './ViewletSourceControl.js'

export const name = 'Source Control'

// prettier-ignore
export const Commands = {
  acceptInput: ViewletSourceControl.acceptInput,
  handleMouseOver: ViewletSourceControl.handleMouseOver,
}

export const Css = [
  '/css/parts/ViewletSourceControl.css',
  '/css/parts/InputBox.css',
  '/css/parts/TreeItem.css',
]

export * from './ViewletSourceControl.js'
