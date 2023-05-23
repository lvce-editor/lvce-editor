import * as Assert from '../Assert/Assert.js'
import * as Icon from '../Icon/Icon.js'
import * as Id from '../Id/Id.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

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
  const { x, y, width, height, tabsWidth, tabs } = state
  const uid = tabs[0].uid
  return [
    {
      id: ViewletModuleId.Terminal,
      x,
      y,
      width: width - tabsWidth,
      height,
      uid,
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
        uid: Id.create(),
      },
    ],
    selectedIndex: 0,
    terminalTabsEnabled,
  }
}

export const addTerminal = async (state) => {
  const { tabs, x, y, width, height, uid, selectedIndex } = state
  const childUid = Id.create()
  const newTab = {
    label: `tab ${tabs.length + 1}`,
    icon: Icon.Terminal,
    uid: childUid,
  }
  const newTabs = [...tabs, newTab]
  const newSelectedIndex = newTabs.length - 1
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
  const oldTab = tabs[selectedIndex]
  const disposeCommands = Viewlet.disposeFunctional(oldTab.uid)
  commands.push(...disposeCommands)
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  return {
    ...state,
    tabs: newTabs,
    selectedIndex: newSelectedIndex,
  }
}

export const focusIndex = async (state, index) => {
  Assert.object(state)
  Assert.number(index)
  const { tabs, x, y, width, height, uid, selectedIndex } = state
  const childUid = Id.create()
  const newTab = tabs[index]
  newTab.uid = childUid
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
  const oldTab = tabs[selectedIndex]
  const disposeCommands = Viewlet.disposeFunctional(oldTab.uid)
  commands.push(...disposeCommands)
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  return {
    ...state,
    selectedIndex: index,
  }
}

export const handleClickTab = (state, index) => {
  return focusIndex(state, index)
}
