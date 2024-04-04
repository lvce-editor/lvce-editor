import * as ViewletActivityBar from './ViewletActivityBar.js'

export const Events = {
  'SourceControl.changeBadgeCount': ViewletActivityBar.updateSourceControlCount,
  'Layout.hideSideBar': ViewletActivityBar.handleSideBarHidden,
  'SideBar.viewletChange': ViewletActivityBar.handleSideBarViewletChange,
}

export * from './ViewletActivityBar.js'
export * from './ViewletActivityBarCommands.js'
export * from './ViewletActivityBarCss.js'
export * from './ViewletActivityBarKeyBindings.js'
export * from './ViewletActivityBarMenuEntries.js'
export * from './ViewletActivityBarName.js'
export * from './ViewletActivityBarQuickPickMenuEntries.js'
export * from './ViewletActivityBarRenderVirtualDom.js'
export * from './ViewletActivityBarResize.js'
