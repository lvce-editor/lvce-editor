import * as Assert from '../Assert/Assert.js'
import * as BackgroundTabs from '../BackgroundTabs/BackgroundTabs.js'
import * as Id from '../Id/Id.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import { closeEditor } from './ViewletMain.js'

export const focusIndex = async (state, index) => {
  if (index === state.activeIndex) {
    return state
  }
  const oldActiveIndex = state.activeIndex
  state.activeIndex = index

  const editor = state.editors[index]
  const x = state.x
  const y = state.y + state.tabHeight
  const width = state.width
  const contentHeight = state.height - state.tabHeight
  const id = ViewletMap.getModuleId(editor.uri)

  const oldEditor = state.editors[oldActiveIndex]
  const oldId = ViewletMap.getModuleId(oldEditor.uri)
  const oldInstance = ViewletStates.getInstance(oldId)

  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, id, state.uid, editor.uri, x, y, width, contentHeight)
  instance.show = false
  instance.setBounds = false
  instance.uid = instanceUid
  editor.uid = instanceUid

  // TODO race condition
  // RendererProcess.invoke(

  // )

  const tabFocusCommand = ['Viewlet.send', state.tabsUid, 'setFocusedIndex', oldActiveIndex, state.activeIndex]
  const resizeCommands = ['Viewlet.setBounds', instanceUid, x, state.tabHeight, width, contentHeight]
  const previousUid = oldEditor.uid
  Assert.number(previousUid)
  const disposeCommands = Viewlet.disposeFunctional(previousUid)
  if (BackgroundTabs.has(editor.uri)) {
    const props = BackgroundTabs.get(editor.uri)
    // @ts-ignore
    const commands = await ViewletManager.load(instance, false, false, props)
    commands.push(...disposeCommands, tabFocusCommand)
    commands.push(resizeCommands)
    commands.push(['Viewlet.append', state.uid, instanceUid])
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  } else {
    // @ts-ignore
    const commands = await ViewletManager.load(instance)
    commands.unshift(...disposeCommands, tabFocusCommand)
    commands.push(resizeCommands)
    commands.push(['Viewlet.append', state.uid, instanceUid])
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }

  if (oldInstance && oldInstance.factory.hide) {
    await oldInstance.factory.hide(oldInstance.state)
    BackgroundTabs.add(oldInstance.state.uri, oldInstance.state)
  }
  return state
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
