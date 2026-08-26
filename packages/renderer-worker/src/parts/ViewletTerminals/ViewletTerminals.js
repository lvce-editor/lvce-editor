import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as GetTerminalSpawnOptions from '../GetTerminalSpawnOptions/GetTerminalSpawnOptions.js'
import * as Id from '../Id/Id.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

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
    activeTerminalUids: [],
    childUid: -1,
    childUids: [],
    cwd: uri,
    focusVersion: 0,
    selectedIndex: -1,
  }
}

const getTerminalUids = (tab) => {
  return tab.terminalUids || [tab.uid]
}

const getShellName = (command) => {
  const fileName = command.split(/[\\/]/).at(-1)
  return fileName?.replace(/\.exe$/i, '') || 'terminal'
}

const getShellIcon = (shellName) => {
  switch (shellName.toLowerCase()) {
    case 'bash':
    case 'fish':
    case 'sh':
    case 'zsh':
      return 'terminal-bash'
    case 'cmd':
      return 'terminal-cmd'
    case 'powershell':
    case 'pwsh':
      return 'terminal-powershell'
    default:
      return 'terminal'
  }
}

const createTab = (uid, command) => {
  const label = getShellName(command)
  return {
    icon: getShellIcon(label),
    label,
    terminalUids: [uid],
    uid,
  }
}

export const getOwnedViewletIds = (state) => {
  const { tabs } = state
  return tabs.flatMap(getTerminalUids)
}

const getContentWidth = (state) => {
  const { tabs, width, tabsWidth, terminalTabsEnabled } = state
  return terminalTabsEnabled && tabs.length > 1 ? width - tabsWidth : width
}

const getChildBounds = (state, index = 0, count = 1) => {
  const { x, y, height } = state
  const contentWidth = getContentWidth(state)
  const width = contentWidth / count
  return {
    x: x + width * index,
    y,
    width,
    height,
  }
}

const createViewlet = async (state, childUid, spawnOptions, cwd = '', index = 0, count = 1) => {
  const bounds = getChildBounds(state, index, count)
  await Command.execute('Layout.createViewlet', ViewletModuleId.Terminal2, childUid, 0, bounds, cwd, [spawnOptions])
}

const resizeTerminals = async (state, terminalUids) => {
  return (await Promise.all(terminalUids.map((uid, index) => Viewlet.resize(uid, getChildBounds(state, index, terminalUids.length))))).flat()
}

const sendCommands = async (commands) => {
  if (commands.length > 0) {
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }
}

const restoreExistingTerminals = async (state, terminalTabsEnabled) => {
  const existingInstance = ViewletStates.getInstance(ViewletModuleId.Terminals)
  const existingState = existingInstance?.state
  if (!existingState || existingState.uid === state.uid) {
    return undefined
  }
  if (existingState.tabs.length === 0) {
    ViewletStates.remove(existingState.uid)
    return undefined
  }
  const restoredState = {
    ...existingState,
    uid: state.uid,
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    terminalTabsEnabled,
  }
  await sendCommands(await resizeTerminals(restoredState, restoredState.childUids))
  ViewletStates.remove(existingState.uid)
  return restoredState
}

export const loadContent = async (state) => {
  const { cwd } = state
  const terminalTabsEnabled = Preferences.get('terminal.tabs.enabled') !== false
  const restoredState = await restoreExistingTerminals(state, terminalTabsEnabled)
  if (restoredState) {
    return restoredState
  }
  const spawnOptions = await GetTerminalSpawnOptions.getTerminalSpawnOptions()
  const childUid = Id.create()
  const newState = {
    ...state,
    activeTerminalUids: [childUid],
    childUid,
    childUids: [childUid],
    selectedIndex: 0,
    tabs: [createTab(childUid, spawnOptions.command)],
    terminalTabsEnabled,
  }
  await createViewlet(newState, childUid, spawnOptions, cwd)
  return newState
}

export const addTerminal = async (state, cwd = '') => {
  const { activeTerminalUids, focusVersion, tabs: oldTabs } = state
  const spawnOptions = await GetTerminalSpawnOptions.getTerminalSpawnOptions()
  const childUid = Id.create()
  const newTab = createTab(childUid, spawnOptions.command)
  const tabs = [...oldTabs, newTab]
  const selectedIndex = tabs.length - 1
  const newState = {
    ...state,
    activeTerminalUids: [...activeTerminalUids, childUid],
    childUid,
    childUids: [childUid],
    focusVersion: focusVersion + 1,
    selectedIndex,
    tabs,
  }
  await createViewlet(newState, childUid, spawnOptions, cwd)
  return newState
}

export const focusIndex = async (state, index) => {
  Assert.object(state)
  Assert.number(index)
  const { activeTerminalUids, focusVersion, tabs } = state
  if (index < 0 || index >= tabs.length) {
    return state
  }
  const childUids = getTerminalUids(tabs[index])
  const childUid = activeTerminalUids[index] || childUids[0]
  await sendCommands(await resizeTerminals(state, childUids))
  return {
    ...state,
    childUid,
    childUids,
    focusVersion: focusVersion + 1,
    selectedIndex: index,
  }
}

export const splitTerminal = async (state) => {
  const { activeTerminalUids: oldActiveTerminalUids, childUid: oldChildUid, focusVersion, selectedIndex, tabs: oldTabs } = state
  if (oldChildUid === -1) {
    return addTerminal(state)
  }
  const tab = oldTabs[selectedIndex]
  const terminalUids = getTerminalUids(tab)
  const activeIndex = Math.max(0, terminalUids.indexOf(oldChildUid))
  const spawnOptions = await GetTerminalSpawnOptions.getTerminalSpawnOptions()
  const childUid = Id.create()
  const childUids = terminalUids.toSpliced(activeIndex + 1, 0, childUid)
  const tabs = oldTabs.with(selectedIndex, {
    ...tab,
    terminalUids: childUids,
  })
  const activeTerminalUids = oldActiveTerminalUids.with(selectedIndex, childUid)
  const newState = {
    ...state,
    activeTerminalUids,
    childUid,
    childUids,
    focusVersion: focusVersion + 1,
    tabs,
  }
  await createViewlet(newState, childUid, spawnOptions, '', activeIndex + 1, childUids.length)
  const existingTerminalUids = childUids.filter((uid) => uid !== childUid)
  const resizeCommands = (
    await Promise.all(existingTerminalUids.map((uid) => Viewlet.resize(uid, getChildBounds(newState, childUids.indexOf(uid), childUids.length))))
  ).flat()
  await sendCommands(resizeCommands)
  return newState
}

export const handleMouseDown = (state, childUid) => {
  Assert.number(childUid)
  const { activeTerminalUids, childUids, focusVersion, selectedIndex } = state
  if (!childUids.includes(childUid)) {
    return state
  }
  return {
    ...state,
    activeTerminalUids: activeTerminalUids.with(selectedIndex, childUid),
    childUid,
    focusVersion: focusVersion + 1,
  }
}

export const killTerminal = async (state) => {
  const { activeTerminalUids: oldActiveTerminalUids, childUid, focusVersion, selectedIndex, tabs: oldTabs } = state
  if (childUid === -1 || selectedIndex === -1) {
    return state
  }
  const tab = oldTabs[selectedIndex]
  const terminalUids = getTerminalUids(tab)
  const terminalIndex = terminalUids.indexOf(childUid)
  if (terminalIndex === -1) {
    return state
  }

  const remainingTerminalUids = terminalUids.filter((uid) => uid !== childUid)
  let tabs = oldTabs
  let activeTerminalUids = oldActiveTerminalUids
  let newSelectedIndex = selectedIndex
  let childUids = remainingTerminalUids
  let newChildUid

  if (remainingTerminalUids.length > 0) {
    newChildUid = remainingTerminalUids[Math.min(terminalIndex, remainingTerminalUids.length - 1)]
    tabs = tabs.with(selectedIndex, {
      ...tab,
      terminalUids: remainingTerminalUids,
    })
    activeTerminalUids = activeTerminalUids.with(selectedIndex, newChildUid)
  } else {
    tabs = tabs.toSpliced(selectedIndex, 1)
    activeTerminalUids = activeTerminalUids.toSpliced(selectedIndex, 1)
    newSelectedIndex = tabs.length === 0 ? -1 : Math.min(selectedIndex, tabs.length - 1)
    childUids = newSelectedIndex === -1 ? [] : getTerminalUids(tabs[newSelectedIndex])
    newChildUid = newSelectedIndex === -1 ? -1 : activeTerminalUids[newSelectedIndex] || childUids[0]
  }

  const newState = {
    ...state,
    activeTerminalUids,
    childUid: newChildUid,
    childUids,
    focusVersion: newChildUid === -1 ? focusVersion : focusVersion + 1,
    selectedIndex: newSelectedIndex,
    tabs,
  }
  const commands = Viewlet.disposeFunctional(childUid)
  if (childUids.length > 0) {
    commands.push(...(await resizeTerminals(newState, childUids)))
  }
  await sendCommands(commands)
  return newState
}

export const handleClickTab = (state, index) => {
  return focusIndex(state, Number(index))
}

export const killTerminalTab = async (state, index) => {
  Assert.number(index)
  const { activeTerminalUids: oldActiveTerminalUids, focusVersion, tabs: oldTabs } = state
  if (index < 0 || index >= oldTabs.length) {
    return state
  }
  const tab = oldTabs[index]
  const terminalUids = getTerminalUids(tab)
  const tabs = oldTabs.toSpliced(index, 1)
  const activeTerminalUids = oldActiveTerminalUids.toSpliced(index, 1)
  const selectedIndex = tabs.length === 0 ? -1 : Math.max(0, index - 1)
  const childUids = selectedIndex === -1 ? [] : getTerminalUids(tabs[selectedIndex])
  const childUid = selectedIndex === -1 ? -1 : activeTerminalUids[selectedIndex] || childUids[0]
  const newState = {
    ...state,
    activeTerminalUids,
    childUid,
    childUids,
    focusVersion: childUid === -1 ? focusVersion : focusVersion + 1,
    selectedIndex,
    tabs,
  }
  const commands = terminalUids.flatMap((uid) => Viewlet.disposeFunctional(uid))
  if (childUids.length > 0) {
    commands.push(...(await resizeTerminals(newState, childUids)))
  }
  await sendCommands(commands)
  return newState
}

export const handleClickTerminalTabAction = (state, index, command) => {
  Assert.string(command)
  switch (command) {
    case 'killTerminalTab':
      return killTerminalTab(state, Number(index))
    default:
      throw new Error(`Unknown terminal tab action: ${command}`)
  }
}

export const sendText = async (state, text) => {
  Assert.string(text)
  const { childUid } = state
  if (childUid === -1) {
    throw new Error('No active terminal')
  }
  await Viewlet.executeViewletCommand(childUid, 'handleInput', text)
  return state
}

export const handleClickAction = (state, indexOrCommand, command = indexOrCommand) => {
  Assert.string(command)
  switch (command) {
    case 'addTerminal':
      return addTerminal(state)
    case 'killTerminal':
      return killTerminal(state)
    case 'splitTerminal':
      return splitTerminal(state)
    default:
      throw new Error(`Unknown terminal action: ${command}`)
  }
}

export const focus = (state) => {
  const { childUid, focusVersion } = state
  if (childUid === -1) {
    return state
  }
  return {
    ...state,
    focusVersion: focusVersion + 1,
  }
}

export const resize = async (state, dimensions) => {
  const resizedState = {
    ...state,
    ...dimensions,
  }
  const { childUids } = resizedState
  const commands = await resizeTerminals(resizedState, childUids)
  return {
    newState: resizedState,
    commands,
  }
}
