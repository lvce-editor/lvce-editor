import * as Assert from '../Assert/Assert.ts'
import * as GetTabIndex from '../GetTabIndex/GetTabIndex.js'
import * as Id from '../Id/Id.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import { closeGroupEditor } from './ViewletMainCloseGroupEditor.ts'
import { focusGroupIndex } from './ViewletMainFocusGroupIndex.js'

export const focusIndex = async (state, index) => {
  const { groups, tabHeight, uid, activeGroupIndex } = state
  const group = groups[activeGroupIndex]
  const editors = group.editors
  const oldActiveIndex = group.activeIndex
  if (index === oldActiveIndex) {
    return {
      newState: state,
      commands: [],
    }
  }
  const newGroup = { ...group, activeIndex: index }
  const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
  const newState = {
    ...state,
    groups: newGroups,
  }
  const editor = editors[index]
  const x = group.x
  const y = group.y + tabHeight
  const width = group.width
  const contentHeight = group.height - tabHeight
  const id = await ViewletMap.getModuleId(editor.uri)

  const oldEditor = editors[oldActiveIndex]
  const oldId = await ViewletMap.getModuleId(oldEditor.uri)
  // @ts-ignore
  const oldInstance = ViewletStates.getInstance(oldId)

  const previousUid = oldEditor.uid
  Assert.number(previousUid)
  const disposeCommands = Viewlet.disposeFunctional(previousUid)

  const maybeHiddenEditorInstance = ViewletStates.getInstance(editor.uid)
  if (maybeHiddenEditorInstance) {
    const commands = Viewlet.showFunctional(editor.uid)
    const allCommands = [...disposeCommands, ...commands]
    return {
      newState,
      commands: allCommands,
    }
  }

  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, id, uid, editor.uri, x, y, width, contentHeight)
  instance.show = false
  instance.setBounds = false
  instance.uid = instanceUid
  editor.uid = instanceUid

  const resizeCommands = ['Viewlet.setBounds', instanceUid, x, tabHeight, width, contentHeight]

  // @ts-ignore
  const commands = await ViewletManager.load(instance)
  // @ts-ignore
  commands.unshift(...disposeCommands)
  // @ts-ignore
  commands.push(resizeCommands)
  // @ts-ignore
  commands.push(['Viewlet.append', uid, instanceUid])
  return {
    newState,
    commands,
  }
}

const focus = (state, getIndex) => {
  const { groups, activeGroupIndex } = state
  const group = groups[activeGroupIndex]
  const { editors, activeIndex } = group
  const index = getIndex(editors, activeIndex)
  return focusIndex(state, index)
}

const getFirstindex = () => {
  return 0
}

export const focusFirst = (state) => {
  return focus(state, getFirstindex)
}

const getLastIndex = (editors) => {
  return editors.length - 1
}

export const focusLast = (state) => {
  return focus(state, getLastIndex)
}

const getPreviousIndex = (editors, activeIndex) => {
  return activeIndex === 0 ? editors.length - 1 : activeIndex - 1
}

export const focusPrevious = (state) => {
  return focus(state, getPreviousIndex)
}

const getNextIndex = (editors, activeIndex) => {
  return activeIndex === editors.length - 1 ? 0 : activeIndex + 1
}

export const focusNext = (state) => {
  return focus(state, getNextIndex)
}

// TODO make computation more efficient
const getIsCloseButton = (tabs, index, eventX, x) => {
  let total = 0
  for (let i = 0; i <= index; i++) {
    total += tabs[index].tabWidth
  }
  // @ts-ignore
  const tab = tabs[index]
  const offset = eventX - x - total
  const closeButtonWidth = 23
  return -offset < closeButtonWidth
}

export const handleTabClick = (state, button, eventX, eventY) => {
  Assert.number(button)
  Assert.number(eventX)
  Assert.number(eventY)
  const { groups } = state
  let actionGroupIndex = -1
  let actionIndex = -1
  for (const group of groups) {
    const { editors, x, y } = group
    const index = GetTabIndex.getTabIndex(editors, x, eventX)
    if (index >= 0) {
      actionGroupIndex = groups.indexOf(group)
      actionIndex = index
      break
    }
  }
  if (actionGroupIndex === -1) {
    return state
  }
  const actionGroup = groups[actionGroupIndex]
  const isCloseButton = getIsCloseButton(actionGroup.editors, actionIndex, eventX, actionGroup.x)

  if (isCloseButton) {
    return closeGroupEditor(state, actionGroupIndex, actionIndex)
  }
  switch (button) {
    case MouseEventType.LeftClick:
      return focusGroupIndex(state, actionGroupIndex, actionIndex)
    case MouseEventType.MiddleClick:
      return closeGroupEditor(state, actionGroupIndex, actionIndex)
    default:
      return state
  }
}
