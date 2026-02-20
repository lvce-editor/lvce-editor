import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as Id from '../Id/Id.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
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
    childUid: -1,
    selectedIndex: -1,
  }
}

export const getChildren = (state) => {
  return []
}

const getChildBounds = (state) => {
  const { x, y, width, height, tabsWidth, terminalTabsEnabled } = state
  if (!terminalTabsEnabled) {
    return {
      x,
      y,
      width,
      height,
    }
  }
  return {
    x,
    y,
    width: width - tabsWidth,
    height,
  }
}

const createViewlet = async (state, childUid) => {
  const bounds = getChildBounds(state)
  await Command.execute('Layout.createViewlet', ViewletModuleId.Terminal, childUid, 0, bounds, '')
}

export const loadContent = async (state) => {
  const terminalTabsEnabled = Preferences.get('terminal.tabs.enabled')
  const childUid = Id.create()
  await createViewlet(
    {
      ...state,
      terminalTabsEnabled,
    },
    childUid,
  )

  return {
    ...state,
    tabs: [
      {
        label: 'tab 1',
        icon: 'Terminal',
        uid: childUid,
      },
    ],
    childUid,
    selectedIndex: 0,
    terminalTabsEnabled,
  }
}

export const addTerminal = async (state) => {
  const { tabs, childUid: oldChildUid } = state
  const childUid = Id.create()
  const newTab = {
    label: `tab ${tabs.length + 1}`,
    icon: 'Terminal',
    uid: childUid,
  }
  const newTabs = [...tabs, newTab]
  const newSelectedIndex = newTabs.length - 1
  await createViewlet(state, childUid)
  if (oldChildUid !== -1) {
    const disposeCommands = Viewlet.disposeFunctional(oldChildUid)
    await RendererProcess.invoke('Viewlet.sendMultiple', disposeCommands)
  }
  return {
    ...state,
    tabs: newTabs,
    childUid,
    selectedIndex: newSelectedIndex,
  }
}

export const focusIndex = async (state, index) => {
  Assert.object(state)
  Assert.number(index)
  const { tabs, selectedIndex, childUid: oldChildUid } = state
  if (index === selectedIndex) {
    return state
  }
  const tab = tabs[index]
  const childUid = tab.uid
  await createViewlet(state, childUid)
  if (oldChildUid !== -1) {
    const disposeCommands = Viewlet.disposeFunctional(oldChildUid)
    await RendererProcess.invoke('Viewlet.sendMultiple', disposeCommands)
  }
  return {
    ...state,
    childUid,
    selectedIndex: index,
  }
}

export const handleClickTab = (state, index) => {
  return focusIndex(state, index)
}

export const resize = async (state, dimensions) => {
  const { childUid } = state
  if (childUid === -1) {
    return {
      newState: state,
      commands: [],
    }
  }
  const resizedState = {
    ...state,
    ...dimensions,
  }
  const childDimensions = getChildBounds(resizedState)
  const commands = await Viewlet.resize(childUid, childDimensions)
  return {
    newState: resizedState,
    commands,
  }
}
