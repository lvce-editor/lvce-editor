export const LazyCommands = {
  focusFirst: () => import('./VirtualListFocusFirst.js'),
  focusIndex: () => import('./VirtualListFocusIndex.js'),
  focusLast: () => import('./VirtualListFocusLast.js'),
  focusNext: () => import('./VirtualListFocusNext.js'),
  focusNextPage: () => import('./VirtualListFocusNextPage.js'),
  focusPreviousPage: () => import('./VirtualListFocusPreviousPage.js'),
  handleTouchStart: () => import('./VirtualListHandleTouchStart.js'),
  handleTouchEnd: () => import('./VirtualListHandleTouchEnd.js'),
  handleTouchMove: () => import('./VirtualListHandleTouchMove.js'),
  handleWheel: () => import('./VirtualListHandleWheel.js'),
}
