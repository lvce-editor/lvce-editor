import * as Assert from '../Assert/Assert.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Id from '../Id/Id.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const openUri = async (state, uri, focus = true, options = {}) => {
  Assert.object(state)
  Assert.string(uri)
  const x = state.x
  const y = state.y + state.tabHeight
  const width = state.width
  const contentHeight = state.height - state.tabHeight
  const moduleId = ViewletMap.getModuleId(uri)
  const previousEditor = state.editors[state.activeIndex]
  let disposeCommands
  if (previousEditor) {
    const previousUid = previousEditor.uid
    disposeCommands = Viewlet.disposeFunctional(previousUid)
  }
  for (const editor of state.editors) {
    if (editor.uri === uri) {
      if (editor === previousEditor) {
        return {
          newState: state,
          commands: [],
        }
      }
      const childUid = Id.create()
      // TODO if the editor is already open, nothing needs to be done
      const instance = ViewletManager.create(ViewletModule.load, moduleId, state.uid, uri, x, y, width, contentHeight)
      instance.show = false
      instance.setBounds = false
      instance.uid = childUid
      // @ts-ignore
      const commands = await ViewletManager.load(instance, focus, false, options)
      if (disposeCommands) {
        commands.unshift(...disposeCommands)
      }
      commands.push(['Viewlet.append', state.uid, childUid])
      const newActiveIndex = state.editors.indexOf(editor)
      commands.push(['Viewlet.setBounds', childUid, x, state.tabHeight, width, contentHeight])
      commands.push(['Viewlet.send', state.tabsUid, 'setFocusedIndex', state.activeIndex, newActiveIndex])
      state.activeIndex = newActiveIndex
      editor.uid = childUid
      return {
        newState: state,
        commands,
      }
    }
  }

  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, moduleId, state.uid, uri, x, y, width, contentHeight)
  instance.uid = instanceUid
  // const oldActiveIndex = state.activeIndex
  const tabLabel = PathDisplay.getLabel(uri)
  const tabTitle = PathDisplay.getTitle(uri)
  const icon = IconTheme.getFileNameIcon(uri)
  const newEditors = [...state.editors, { uri, uid: instanceUid, label: tabLabel, title: tabTitle, icon }]
  const newActiveIndex = newEditors.length - 1
  // @ts-ignore
  instance.show = false
  instance.setBounds = false
  // @ts-ignore
  const commands = await ViewletManager.load(instance, focus)
  commands.push(['Viewlet.setBounds', instanceUid, x, state.tabHeight, width, contentHeight])
  let tabsUid = state.tabsUid
  if (tabsUid === -1) {
    tabsUid = Id.create()
  }
  if (disposeCommands) {
    commands.push(...disposeCommands)
  }
  commands.push(['Viewlet.append', state.uid, instanceUid])
  if (focus) {
    commands.push(['Viewlet.focus', instanceUid])
  }
  const latestEditor = newEditors[newActiveIndex]
  if (latestEditor.uid !== instanceUid) {
    return {
      newState: state,
      commands: [],
    }
  }
  if (!ViewletStates.hasInstance(instanceUid)) {
    return {
      newState: state,
      commands,
    }
  }
  return {
    newState: {
      ...state,
      tabsUid,
      editors: newEditors,
      activeIndex: newActiveIndex,
    },
    commands,
  }
}
