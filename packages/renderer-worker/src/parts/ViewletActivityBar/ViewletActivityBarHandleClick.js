import * as Command from '../Command/Command.js'
import * as Layout from '../Layout/Layout.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

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
  if (Layout.isSideBarVisible()) {
    await Command.execute(
      /* SideBar.showOrHideViewlet */ 'SideBar.showOrHideViewlet',
      /* id */ viewletId
    )
  } else {
    // TODO should show side bar with viewletId
    await Layout.showSideBar()
  }
  return state
}

export const handleClick = async (state, index, x, y) => {
  const viewletId = state.activityBarItems[index].id
  switch (viewletId) {
    case 'Settings':
      return handleClickSettings(state, x, y, viewletId)
    case 'Additional Views':
      return handleClickAdditionalViews(state, x, y, viewletId)
    default:
      return handleClickOther(state, x, y, viewletId)
  }
}
