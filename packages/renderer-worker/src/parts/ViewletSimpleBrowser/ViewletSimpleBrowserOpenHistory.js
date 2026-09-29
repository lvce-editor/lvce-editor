import * as SimpleBrowser from './ViewletSimpleBrowser.js'

export const openHistory = async (state) => {
  return SimpleBrowser.openTab(state, SimpleBrowser.simpleBrowserHistoryUrl, 'foreground-tab')
}
