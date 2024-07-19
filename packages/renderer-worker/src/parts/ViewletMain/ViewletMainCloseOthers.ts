import * as Id from '../Id/Id.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import type { MainState } from './ViewletMainTypes.ts'

export const closeOthers = async (state: MainState) => {
  const commands: any[] = []
  const { groups, activeGroupIndex } = state
  const group = groups[activeGroupIndex]
  const { editors, focusedIndex, activeIndex } = group
  let newEditors = editors
  let newFocusedIndex = focusedIndex
  let newActiveIndex = activeIndex
  if (focusedIndex === activeIndex) {
    // view is kept the same, only tabs are closed
    newEditors = [editors[focusedIndex]]
    newFocusedIndex = 0
    newActiveIndex = 0
  } else {
    // view needs to be switched to focused index
    const activeEditor = editors[activeIndex]
    // @ts-ignore
    const focusedEditor = editors[focusedIndex]
    newEditors = [focusedEditor]
    newFocusedIndex = 0
    newActiveIndex = 0
    const disposeCommands = Viewlet.disposeFunctional(activeEditor.uid)
    commands.push(...disposeCommands)
    const instanceUid = Id.create()
    const moduleId = ViewletMap.getModuleId(activeEditor.uri)
    // @ts-ignore
    const x = state.x
    // @ts-ignore
    const y = state.y + state.tabHeight
    // @ts-ignore
    const width = state.width
    // @ts-ignore
    const contentHeight = state.height - state.tabHeight
    // @ts-ignore
    const instance = ViewletManager.create(ViewletModule.load, moduleId, state.uid, focusedEditor.uri, x, y, width, contentHeight)
    instance.uid = instanceUid
    instance.show = false
    instance.setBounds = false
    // @ts-ignore
    const instanceCommands = await ViewletManager.load(instance, false, false, {})
    commands.push(...instanceCommands)
    // @ts-ignore
    commands.push(['Viewlet.setBounds', instanceUid, x, state.tabHeight, width, contentHeight])
    // @ts-ignore
    commands.push(['Viewlet.append', state.uid, instanceUid])
  }
  const newGroup = {
    ...group,
    editors: newEditors,
    focusedIndex: newFocusedIndex,
    activeIndex: newActiveIndex,
  }
  const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
  return {
    newState: {
      ...state,
      groups: newGroups,
    },
    commands,
  }
}
