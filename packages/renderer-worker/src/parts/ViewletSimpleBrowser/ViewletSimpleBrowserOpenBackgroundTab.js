import * as Command from '../Command/Command.js'
import * as SimpleBrowser from './ViewletSimpleBrowser.js'

export const openBackgroundTab = async (state, url) => {
  const { tabsEnabled } = state
  if (!tabsEnabled) {
    await Command.execute('Main.openBackgroundTab', 'simple-browser://', { iframeSrc: url })
    return state
  }
  return SimpleBrowser.openTab(state, url, 'background-tab')
}
