import type { LayoutState } from './LayoutState.ts'

// Without a primary sidebar there is no dedicated space for the window buttons.
export const isCompactTitleBar = (state: LayoutState): boolean => {
  return state.titleBarless && state.titleBarVisible && state.sideBarVisible && !state.browserFullWidth && !state.sideBarFocusMode
}
