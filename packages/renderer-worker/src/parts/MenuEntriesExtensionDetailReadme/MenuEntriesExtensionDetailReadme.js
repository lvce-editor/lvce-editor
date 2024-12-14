import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const id = MenuEntryId.ExtensionDetailReadme

export const getMenuEntries = async (props) => {
  const menuEntries = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getMenuEntries', props)
  return menuEntries
}
