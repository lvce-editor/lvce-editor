import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as Focus from '../Focus/Focus.js'
import * as GetTerminalTabsDom from '../GetTerminalTabsDom/GetTerminalTabsDom.js'
import * as GetTerminalSpawnOptions from '../GetTerminalSpawnOptions/GetTerminalSpawnOptions.js'
import * as Id from '../Id/Id.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

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
  return terminalTabsEnabled && GetTerminalTabsDom.hasVisibleTabs(tabs) ? width - tabsWidth : width
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
  const spawnOptions = await GetTerminalSpawnOptions.getTerminalSpawnOptions(cwd)
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
  const spawnOptions = await GetTerminalSpawnOptions.getTerminalSpawnOptions(cwd)
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

export const focusIndex = async (state, index, terminalUid) => {
  Assert.object(state)
  Assert.number(index)
  const { activeTerminalUids, focusVersion, tabs } = state
  if (index < 0 || index >= tabs.length) {
    return state
  }
  const childUids = getTerminalUids(tabs[index])
  const requestedTerminalUid = Number(terminalUid)
  const childUid = childUids.includes(requestedTerminalUid) ? requestedTerminalUid : activeTerminalUids[index] || childUids[0]
  await sendCommands(await resizeTerminals(state, childUids))
  return {
    ...state,
    activeTerminalUids: activeTerminalUids.with(index, childUid),
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
  Focus.setFocus(WhenExpression.FocusTerminal)
  return {
    ...state,
    activeTerminalUids: activeTerminalUids.with(selectedIndex, childUid),
    childUid,
    focusVersion: focusVersion + 1,
  }
}

const removeTerminal = async (state, terminalUid, dispose = true) => {
  const { activeTerminalUids: oldActiveTerminalUids, childUid: oldChildUid, focusVersion, selectedIndex: oldSelectedIndex, tabs: oldTabs } = state
  if (terminalUid === -1) {
    return state
  }
  const terminalTabIndex = oldTabs.findIndex((tab) => getTerminalUids(tab).includes(terminalUid))
  if (terminalTabIndex === -1) {
    return state
  }
  const tab = oldTabs[terminalTabIndex]
  const terminalUids = getTerminalUids(tab)
  const terminalIndex = terminalUids.indexOf(terminalUid)

  const remainingTerminalUids = terminalUids.filter((uid) => uid !== terminalUid)
  let tabs = oldTabs
  let activeTerminalUids = oldActiveTerminalUids
  let selectedIndex = oldSelectedIndex

  if (remainingTerminalUids.length > 0) {
    const oldActiveTerminalUid = oldActiveTerminalUids[terminalTabIndex]
    const activeTerminalUid = remainingTerminalUids.includes(oldActiveTerminalUid)
      ? oldActiveTerminalUid
      : remainingTerminalUids[Math.min(terminalIndex, remainingTerminalUids.length - 1)]
    tabs = tabs.with(terminalTabIndex, {
      ...tab,
      terminalUids: remainingTerminalUids,
    })
    activeTerminalUids = activeTerminalUids.with(terminalTabIndex, activeTerminalUid)
  } else {
    tabs = tabs.toSpliced(terminalTabIndex, 1)
    activeTerminalUids = activeTerminalUids.toSpliced(terminalTabIndex, 1)
    if (tabs.length === 0) {
      selectedIndex = -1
    } else if (terminalTabIndex < oldSelectedIndex) {
      selectedIndex = oldSelectedIndex - 1
    } else if (terminalTabIndex === oldSelectedIndex) {
      selectedIndex = Math.min(oldSelectedIndex, tabs.length - 1)
    }
  }

  const childUids = selectedIndex === -1 ? [] : getTerminalUids(tabs[selectedIndex])
  const childUid = selectedIndex === -1 ? -1 : activeTerminalUids[selectedIndex] || childUids[0]

  const newState = {
    ...state,
    activeTerminalUids,
    childUid,
    childUids,
    focusVersion: childUid !== -1 && childUid !== oldChildUid ? focusVersion + 1 : focusVersion,
    selectedIndex,
    tabs,
  }
  const commands = dispose ? Viewlet.disposeFunctional(terminalUid) : []
  const terminalUidsToResize = remainingTerminalUids.length > 0 ? remainingTerminalUids : childUids
  if (terminalUidsToResize.length > 0) {
    commands.push(...(await resizeTerminals(newState, terminalUidsToResize)))
  }
  await sendCommands(commands)
  return newState
}

export const handleTerminalExit = (state, terminalUid) => {
  Assert.number(terminalUid)
  return removeTerminal(state, terminalUid)
}

export const killTerminal = async (state) => {
  const newState = await removeTerminal(state, state.childUid)
  if (newState === state) {
    return state
  }
  return {
    ...newState,
    hidePanel: newState.tabs.length === 0,
  }
}

export const afterRender = async (oldState, newState) => {
  if (newState.hidePanel && oldState.tabs.length > 0 && newState.tabs.length === 0) {
    await Command.execute('Layout.hidePanel')
  }
}

export const handleClickTab = (state, index, terminalUid) => {
  return focusIndex(state, Number(index), terminalUid)
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
    hidePanel: tabs.length === 0,
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

export const handleClickTerminalTabAction = (state, index, command, terminalUid) => {
  Assert.string(command)
  switch (command) {
    case 'killTerminalTab':
      return killTerminalTab(state, Number(index))
    case 'killTerminalSplit':
      return removeTerminal(state, Number(terminalUid))
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
  Focus.setFocus(WhenExpression.FocusTerminal)
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

export const serializeCommands = true
export const concurrentCommands = ['handleDrop']

export const detachTerminal = (state, terminalUid) => removeTerminal(state, terminalUid, false)

export const attachTerminal = async (state, tab, sourceIndex = state.tabs.length, splitIndex = -1) => {
  const terminalUid = tab.uid
  if (getOwnedViewletIds(state).includes(terminalUid)) {
    return state
  }
  let tabs = [...state.tabs]
  let activeTerminalUids = [...state.activeTerminalUids]
  let selectedIndex = Math.min(sourceIndex, tabs.length)
  const groupIndex = splitIndex === -1 ? -1 : tabs.findIndex((item) => item.uid === tab.groupUid)
  if (groupIndex !== -1) {
    selectedIndex = groupIndex
    const group = tabs[groupIndex]
    tabs[groupIndex] = { ...group, terminalUids: getTerminalUids(group).toSpliced(splitIndex, 0, terminalUid) }
    activeTerminalUids[groupIndex] = terminalUid
  } else {
    tabs.splice(selectedIndex, 0, { uid: terminalUid, terminalUids: [terminalUid], label: tab.label, icon: tab.icon })
    activeTerminalUids.splice(selectedIndex, 0, terminalUid)
  }
  const next = {
    ...state,
    tabs,
    activeTerminalUids,
    selectedIndex,
    childUid: terminalUid,
    childUids: getTerminalUids(tabs[selectedIndex]),
    focusVersion: state.focusVersion + 1,
  }
  await sendCommands(await resizeTerminals(next, next.childUids))
  return next
}

export const handleTabPointerDown = async (state, rawUid) => {
  const terminalUid = Number(rawUid)
  const tab = state.tabs.find((item) => getTerminalUids(item).includes(terminalUid))
  if (!tab) {
    return state
  }
  await RendererProcess.invoke('Viewlet.sendMultiple', [
    [
      'Viewlet.setDragData',
      state.uid,
      {
        items: [{ type: 'application/x-lvce-terminal', data: `lvce-terminal:${JSON.stringify({ sourceUid: state.uid, terminalUid })}` }],
        label: tab.label,
      },
    ],
  ])
  return state
}

export const handleDragEnd = async (state) => {
  await RendererProcess.invoke('Viewlet.sendMultiple', [['Viewlet.setDragData', state.uid, { items: [], label: '' }]])
  return state
}

export const handleDragStart = (state) => state
export const handleDragOver = (state) => state

// Do not run this callback on the panel command queue: the main-area transfer
// calls back into attachTerminal on that queue before completing.
export const dropTerminal = async (panelUid, dropId) => {
  const MainAreaWorker = await import('../MainAreaWorker/MainAreaWorker.js')
  const { renderMainAreaPending } = await import('../RenderMainAreaPending/RenderMainAreaPending.ts')
  const panel = ViewletStates.getInstance(panelUid)
  if (!panel) {
    return
  }
  const main = ViewletStates.getInstance(ViewletModuleId.Main, panel.state.applicationId)
  if (!main) {
    return
  }
  await MainAreaWorker.invoke('MainArea.handlePanelDrop', main.state.uid, panelUid, dropId)
  await renderMainAreaPending(main.state.uid)
}

export const handleDrop = async (state, dropId) => {
  await dropTerminal(state.uid, dropId)
  return state
}

// Keep running terminals available to restoreExistingTerminals when switching panel tabs.
export const hide = () => {}
