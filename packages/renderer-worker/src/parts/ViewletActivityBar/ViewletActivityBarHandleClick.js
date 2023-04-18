import * as Command from '../Command/Command.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const handleClickSettings = async (state, x, y, viewletId) => {
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Settings)
  return state
}

const handleClickAdditionalViews = async (state, x, y, viewletId) => {
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.ActivityBarAdditionalViews)
  return state
}

const handleClickOther = async (state, x, y, viewletId) => {
  const layoutInstance = ViewletStates.getInstance(ViewletModuleId.Layout)
  const sideBarVisible = layoutInstance.factory.isSideBarVisible(layoutInstance.state)
  if (sideBarVisible) {
    const sideBarState = ViewletStates.getState(ViewletModuleId.SideBar)
    if (sideBarState.currentViewletId === viewletId) {
      await Command.execute('Layout.hideSideBar')
    } else {
      await Command.execute(/* SideBar.show */ 'SideBar.show', /* id */ viewletId)
    }
  } else {
    // TODO should show side bar with viewletId
    await Command.execute('Layout.showSideBar')
  }
  return state
}

export const handleClick = async (state, button, index, x, y) => {
  if (button !== MouseEventType.LeftClick) {
    return state
  }
  const { activityBarItems } = state
  const item = activityBarItems[index]
  const viewletId = item.id
  switch (viewletId) {
    case 'Settings':
      return handleClickSettings(state, x, y, viewletId)
    case 'Additional Views':
      return handleClickAdditionalViews(state, x, y, viewletId)
    default:
      return handleClickOther(state, x, y, viewletId)
  }
}
