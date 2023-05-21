import * as Assert from '../Assert/Assert.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Icon from '../Icon/Icon.js'

export const create = (id, uri, x, y, width, height) => {
  Assert.number(id)
  return {
    disposed: false,
    uid: id,
    tabs: [],
    tabsWidth: 90,
    x,
    y,
    width,
    height,
    selectedIndex: -1,
  }
}

export const getChildren = (state) => {
  const { x, y, width, height, tabsWidth } = state
  return [
    {
      id: ViewletModuleId.Terminal,
      x,
      y,
      width: width - tabsWidth,
      height,
    },
  ]
}

export const loadContent = async (state) => {
  const terminalTabsEnabled = Preferences.get('terminal.tabs.enabled')
  return {
    ...state,
    tabs: [
      {
        label: 'tab 1',
        icon: Icon.Terminal,
      },
    ],
    selectedIndex: 0,
    terminalTabsEnabled,
  }
}
