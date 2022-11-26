import * as ViewletDiffEditor from './ViewletDiffEditor.js'

export const name = 'DiffEditor'

// prettier-ignore
export const Commands = {
}

// prettier-ignore
export const LazyCommands = {
  setDeltaY: () => import('../VirtualList/VirtualListSetDeltaY.js'),
  handleWheel: () => import('../VirtualList/VirtualListHandleWheel.js'),
}

export const Css = [
  '/css/parts/ViewletDiffEditor.css',
  '/css/parts/ViewletEditor.css',
]

export * from './ViewletDiffEditor.js'
