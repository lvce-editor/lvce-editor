import * as Assert from '../Assert/Assert.ts'
import * as ElectronContextMenu from '../ElectronContextMenu/ElectronContextMenu.js'
import * as GetWindowZoomLevel from '../GetWindowZoomLevel/GetWindowZoomLevel.js'
import * as MenuEntriesSimpleBrowser from '../MenuEntriesSimpleBrowser/MenuEntriesSimpleBrowser.js'

export const handleContextMenu = async (state, params) => {
  Assert.object(state)
  Assert.object(params)
  const { browserViewId, x: pageX, y: pageY } = params
  const tab = state.tabs.find((tab) => tab.browserViewId === browserViewId)
  if (!tab) return state
  const zoom = 1.2 ** (await GetWindowZoomLevel.getWindowZoomLevel())
  const x = Math.round(state.x * zoom + pageX)
  const y = Math.round((state.y + state.headerHeight) * zoom + pageY)
  const entries = MenuEntriesSimpleBrowser.getMenuEntries(pageX, pageY, { ...params, canGoBack: tab.canGoBack, canGoForward: tab.canGoForward }).map(
    (entry) =>
      entry.command?.startsWith('SimpleBrowser.')
        ? {
            ...entry,
            command: 'Viewlet.executeViewletCommand',
            args: [state.uid, 'handleContextMenuAction', browserViewId, entry.command.slice('SimpleBrowser.'.length), entry.args || []],
          }
        : entry,
  )
  await ElectronContextMenu.openBrowserContextMenu(x, y, entries, browserViewId)
  return state
}
