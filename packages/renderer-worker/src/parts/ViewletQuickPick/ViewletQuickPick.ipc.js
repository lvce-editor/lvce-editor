import * as ViewletQuickPick from './ViewletQuickPick.js'

// prettier-ignore
export const Commands = {
  'QuickPick.openEverythingQuickPick': ViewletQuickPick.openEverythingQuickPick,
  'QuickPick.dispose': ViewletQuickPick.dispose,
  'QuickPick.hide': ViewletQuickPick.dispose,
  'QuickPick.selectCurrentIndex': ViewletQuickPick.selectCurrentIndex,
  'QuickPick.handleInput': ViewletQuickPick.handleInput,
  'QuickPick.selectIndex': ViewletQuickPick.selectIndex,
  'QuickPick.openCommandPalette': ViewletQuickPick.openCommandPalette,
  'QuickPick.openView': ViewletQuickPick.openView,
  'QuickPick.focusFirst': ViewletQuickPick.focusFirst,
  'QuickPick.focusLast': ViewletQuickPick.focusLast,
  'QuickPick.focusPrevious': ViewletQuickPick.focusPrevious,
  'QuickPick.focusNext': ViewletQuickPick.focusNext,
  'QuickPick.openGoToLine': ViewletQuickPick.openGoToLine,
  'QuickPick.openColorTheme': ViewletQuickPick.openColorTheme,
  'QuickPick.fileOpenRecent': ViewletQuickPick.fileOpenRecent,
  'QuickPick.handleBlur': ViewletQuickPick.handleBlur,
  'QuickPick.showExtensionsQuickPick': ViewletQuickPick.showExtensionsQuickPick,
}

export * from './ViewletQuickPick.js'
