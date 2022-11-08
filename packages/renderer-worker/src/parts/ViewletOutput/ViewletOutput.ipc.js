import * as ViewletOutput from './ViewletOutput.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

// prettier-ignore
const Imports = {
  HandleScrollBarClick: () => import('../ViewletList/ViewletListHandleScrollBarClick.js'),
  HandleWheel: () => import('../ViewletList/ViewletListHandleWheel.js'),
}

// prettier-ignore
export const Commands = {
  handleData: ViewletOutput.handleData,
  handleError: ViewletOutput.handleError,
  handleWheel: LazyCommand.create(ViewletOutput.name, Imports.HandleWheel, 'handleWheel'),
}

export const LazyCommands = {
  handleWheel: Imports.HandleWheel,
}

export const Css = [
  '/css/parts/ViewletOutput.css',
  '/css/parts/ViewletScrollBar.css',
]

export * from './ViewletOutput.js'
