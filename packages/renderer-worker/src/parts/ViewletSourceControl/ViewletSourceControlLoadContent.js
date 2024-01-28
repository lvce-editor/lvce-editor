import * as GetFinalDeltaY from '../GetFinalDeltaY/GetFinalDeltaY.js'
import { getListHeight } from '../GetListHeight/GetListHeight.js'
import * as GetNumberOfVisibleItems from '../GetNumberOfVisibleItems/GetNumberOfVisibleItems.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
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
  const { itemHeight, height, minimumSliderSize } = state
  const root = Workspace.state.workspacePath
  const scheme = GetProtocol.getProtocol(root)
  const enabledProviderIds = await SourceControl.getEnabledProviderIds(scheme, root)
  const { allGroups, gitRoot } = await getGroups(enabledProviderIds)
  const isExpanded = true
  const items = getDisplayItems(allGroups, isExpanded)
  const buttons = await getNewButtons(items, state.providerId, state.buttonIndex)
  const splitButtonEnabled = Preferences.get('sourceControl.splitButtonEnabled')
  const total = items.length
  const contentHeight = total * itemHeight
  const listHeight = getListHeight(total, itemHeight, height)
  const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(height, contentHeight, minimumSliderSize)
  const numberOfVisible = GetNumberOfVisibleItems.getNumberOfVisibleItems(listHeight, itemHeight)
  const maxLineY = Math.min(numberOfVisible, total)
  const finalDeltaY = GetFinalDeltaY.getFinalDeltaY(listHeight, itemHeight, total)
  return {
    ...state,
    allGroups,
    gitRoot,
    items,
    enabledProviderIds,
    isExpanded,
    buttons,
    root,
    splitButtonEnabled,
    maxLineY,
    scrollBarHeight,
    finalDeltaY,
  }
}
