export const Imports = {
  HandleWheel: () => import('./ViewletListHandleWheel.js'),
  HandleScrollBarClick: () => import('./ViewletListHandleScrollBarClick.js'),
  HandleScrollBarMove: () => import('./ViewletListScrollBarMove.js'),
}

export const LazyCommands = {
  handleWheel: Imports.HandleWheel,
  handleScrollBarClick: Imports.HandleScrollBarClick,
  handleScrollBarMove: Imports.HandleScrollBarMove,
}
