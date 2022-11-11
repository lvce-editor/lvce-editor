import * as Command from '../Command/Command.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const handleClickSettings = async (state, x, y, viewletId) => {
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.Settings
  )
  return state
}

const handleClickAdditionalViews = async (state, x, y, viewletId) => {
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.ActivityBarAdditionalViews
  )
  return state
}

const handleClickOther = async (state, x, y, viewletId) => {
  console.log({ state })
  const layoutInstance = ViewletStates.getInstance(ViewletModuleId.Layout)
  const sideBarVisible = layoutInstance.factory.isSideBarVisible(
    layoutInstance.state
  )
  if (sideBarVisible) {
    const sideBarState = ViewletStates.getState(ViewletModuleId.SideBar)
    if (sideBarState.currentViewletId === viewletId) {
      await Command.execute('Layout.hideSideBar')
    } else {
      await Command.execute(
        /* SideBar.show */ 'SideBar.show',
        /* id */ viewletId
      )
    }
  } else {
    // TODO should show side bar with viewletId
    await Command.execute('Layout.showSideBar')
  }
  return state
}

export const handleClick = async (state, index, x, y) => {
  const { activityBarItems } = state
  const viewletId = activityBarItems[index].id
  switch (viewletId) {
    case 'Settings':
      return handleClickSettings(state, x, y, viewletId)
    case 'Additional Views':
      return handleClickAdditionalViews(state, x, y, viewletId)
    default:
      return handleClickOther(state, x, y, viewletId)
  }
}
