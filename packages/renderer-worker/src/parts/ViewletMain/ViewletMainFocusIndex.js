import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import { closeEditor } from './ViewletMainCloseEditor.js'

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
  const id = ViewletMap.getModuleId(editor.uri)

  const oldEditor = editors[oldActiveIndex]
  const oldId = ViewletMap.getModuleId(oldEditor.uri)
  const oldInstance = ViewletStates.getInstance(oldId)

  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, id, uid, editor.uri, x, y, width, contentHeight)
  instance.show = false
  instance.setBounds = false
  instance.uid = instanceUid
  editor.uid = instanceUid

  const resizeCommands = ['Viewlet.setBounds', instanceUid, x, tabHeight, width, contentHeight]
  const previousUid = oldEditor.uid
  Assert.number(previousUid)
  const disposeCommands = Viewlet.disposeFunctional(previousUid)
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

export const focusFirst = (state) => {
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  return focusIndex(state, state.editors.length - 1)
}

export const focusPrevious = (state) => {
  const previousIndex = state.activeIndex === 0 ? state.editors.length - 1 : state.activeIndex - 1
  return focusIndex(state, previousIndex)
}

export const focusNext = (state) => {
  const nextIndex = state.activeIndex === state.editors.length - 1 ? 0 : state.activeIndex + 1
  return focusIndex(state, nextIndex)
}

export const handleTabClick = (state, button, index) => {
  switch (button) {
    case MouseEventType.LeftClick:
      return focusIndex(state, index)
    case MouseEventType.MiddleClick:
      return closeEditor(state, index)
    default:
      return state
  }
}
