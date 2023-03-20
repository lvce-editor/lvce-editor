import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as SourceControl from '../SourceControl/SourceControl.js'
import * as SourceControlActions from '../SourceControlActions/SourceControlActions.js'
import * as Workspace from '../Workspace/Workspace.js'
import { getDisplayItems } from './ViewletSourceControlGetDisplayItems.js'

const getGroups = async (enabledProviderIds) => {
  const allGroups = []
  for (const providerId of enabledProviderIds) {
    const groups = await SourceControl.getGroups(providerId)
    allGroups.push(...groups)
  }
  return {
    allGroups,
    gitRoot: '',
  }
}

const getNewButtons = async (displayItems, providerId, buttonIndex) => {
  if (buttonIndex === -1) {
    return []
  }
  const item = displayItems[buttonIndex]
  if (!item) {
    return []
  }
  const actions = await SourceControlActions.getSourceControlActions(providerId, item.groupId, item.type)
  return actions
}

export const loadContent = async (state) => {
  const root = Workspace.state.workspacePath
  const scheme = GetProtocol.getProtocol(root)
  const enabledProviderIds = await SourceControl.getEnabledProviderIds(scheme, root)
  const { allGroups, gitRoot } = await getGroups(enabledProviderIds)
  const isExpanded = true
  const displayItems = getDisplayItems(allGroups, isExpanded)
  const buttons = await getNewButtons(displayItems, state.providerId, state.buttonIndex)
  return {
    ...state,
    allGroups,
    gitRoot,
    displayItems,
    enabledProviderIds,
    isExpanded,
    buttons,
  }
}
