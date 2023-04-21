import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const closeOthers = async (state) => {
  const commands = []
  if (state.focusedIndex === state.activeIndex) {
    // view is kept the same, only tabs are closed
    state.editors = [state.editors[state.focusedIndex]]
    state.focusedIndex = 0
    state.activeIndex = 0
    commands.push(['Viewlet.send', state.tabsUid, 'setTabs', state.editors])
    commands.push(['Viewlet.send', state.tabsUid, 'setFocusedIndex', -1, 0])
  } else {
    // view needs to be switched to focused index
    const activeEditor = state.editors[state.activeIndex]
    state.editors = [state.editors[state.focusedIndex]]
    state.focusedIndex = 0
    state.activeIndex = 0
    commands.push(['Viewlet.send', state.tabsUid, 'setTabs', state.editors])
    commands.push(['Viewlet.send', state.tabsUid, 'setFocusedIndex', -1, 0])
    const disposeCommands = Viewlet.disposeFunctional(activeEditor.uid)
    commands.push(...disposeCommands)
    const instanceUid = Id.create()
    const moduleId = ViewletMap.getModuleId(activeEditor.uri)
    const x = state.x
    const y = state.y + state.tabHeight
    const width = state.width
    const contentHeight = state.height - state.tabHeight
    const instance = ViewletManager.create(ViewletModule.load, moduleId, ViewletModuleId.Main, activeEditor.uri, x, y, width, contentHeight)
    instance.uid = instanceUid
    instance.show = false
    instance.setBounds = false
    // @ts-ignore
    const instanceCommands = await ViewletManager.load(instance, false, false, {})
    commands.push(...instanceCommands)
    commands.push(['Viewlet.setBounds', instanceUid, x, state.tabHeight, width, contentHeight])
    commands.push(['Viewlet.append', state.uid, instanceUid])
  }
  console.log({ commands })
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  return state
}
