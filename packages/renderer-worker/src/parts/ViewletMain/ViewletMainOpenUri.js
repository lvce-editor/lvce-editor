import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const openUri = async (state, uri, focus = true, options = {}) => {
  Assert.object(state)
  Assert.string(uri)
  const x = state.x
  const y = state.y + state.tabHeight
  const width = state.width
  const height = state.height - state.tabHeight
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
      const instance = ViewletManager.create(ViewletModule.load, moduleId, ViewletModuleId.Main, uri, x, y, width, height)
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
      commands.push(['Viewlet.setBounds', childUid, x, state.tabHeight, width, height - state.tabHeight])
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
  const instance = ViewletManager.create(ViewletModule.load, moduleId, ViewletModuleId.Main, uri, x, y, width, height)
  instance.uid = instanceUid
  const oldActiveIndex = state.activeIndex
  const tabLabel = PathDisplay.getLabel(uri)
  const tabTitle = PathDisplay.getTitle(uri)
  state.editors.push({ uri, uid: instanceUid, label: tabLabel, title: tabTitle })
  state.activeIndex = state.editors.length - 1

  // await RendererProcess.invoke(
  //   /* Viewlet.send */ 'Viewlet.send',
  //   /* id */ state.uid,
  //   /* method */ 'openViewlet',
  //   /* tabLabel */ tabLabel,
  //   /* tabTitle */ tabTitle,
  //   /* oldActiveIndex */ oldActiveIndex
  // )
  // @ts-ignore
  instance.show = false
  instance.setBounds = false
  // @ts-ignore
  const commands = await ViewletManager.load(instance, focus)
  commands.push(['Viewlet.setBounds', instanceUid, x, state.tabHeight, width, height - state.tabHeight])
  let tabsUid = state.tabsUid
  if (tabsUid === -1) {
    console.log('create tabs')
    tabsUid = Id.create()
    state.tabsUid = tabsUid
    commands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsUid])
    commands.push(['Viewlet.setBounds', tabsUid, x, 0, width, state.tabHeight])
    commands.push(['Viewlet.append', state.uid, state.tabsUid])
  }
  commands.push(['Viewlet.send', tabsUid, 'setTabs', state.editors])
  commands.push(['Viewlet.send', tabsUid, 'setFocusedIndex', oldActiveIndex, state.activeIndex])

  // if (commands[0].includes(ViewletModuleId.Error)) {
  //   commands.push(['Viewlet.appendViewlet', state.uid, ViewletModuleId.Error])
  // } else {
  if (disposeCommands) {
    commands.push(...disposeCommands)
  }
  commands.push(['Viewlet.append', state.uid, instanceUid])
  if (focus) {
    commands.push(['Viewlet.focus', instanceUid])
  }
  const latestEditor = state.editors[state.activeIndex]
  console.log({ commands })
  if (latestEditor.uid !== instanceUid) {
    console.log('return now')
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
    newState: state,
    commands,
  }
}
