import * as Assert from '../Assert/Assert.js'
import * as Icon from '../Icon/Icon.js'
import * as Id from '../Id/Id.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

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

export const addTerminal = async (state) => {
  const { tabs, x, y, width, height, uid } = state
  const newTab = {
    label: `tab ${tabs.length + 1}`,
    icon: Icon.Terminal,
  }
  const newTabs = [...tabs, newTab]
  const newSelectedIndex = newTabs.length - 1
  const childUid = Id.create()
  const commands = await ViewletManager.load({
    getModule: ViewletModule.load,
    x,
    y,
    width,
    height,
    uid: childUid,
    moduleId: ViewletModuleId.Terminal,
    id: ViewletModuleId.Terminal,
    show: false,
    append: false,
    type: 0,
    parentId: uid,
  })
  commands.push(['Viewlet.append', uid, childUid])
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  return {
    ...state,
    tabs: newTabs,
    selectedIndex: newSelectedIndex,
  }
}
