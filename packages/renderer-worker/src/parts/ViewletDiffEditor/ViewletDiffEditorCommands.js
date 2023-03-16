// prettier-ignore
export const Commands = {
}

// prettier-ignore
export const LazyCommands = {
  setDeltaY: () => import('../VirtualList/VirtualListSetDeltaY.js'),
  handleWheel: () => import('../VirtualList/VirtualListHandleWheel.js'),
}
