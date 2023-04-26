import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'

export const closeTabsRight = async (state) => {
  const { editors, activeIndex, focusedIndex } = state
  const commands = []
  const newEditors = editors.slice(0, focusedIndex + 1)
  if (focusedIndex >= activeIndex) {
    // view is kept the same, only tabs are closed
  } else {
    // view needs to be switched to focused index
    const previousEditor = editors[activeIndex]
    let disposeCommands = []
    if (previousEditor) {
      const previousUid = previousEditor.uid
      disposeCommands = Viewlet.disposeFunctional(previousUid)
    }
    commands.push(...disposeCommands)
    const newActiveEditor = newEditors[focusedIndex]
    const x = state.x
    const y = state.y + state.tabHeight
    const width = state.width
    const contentHeight = state.height - state.tabHeight
    const uri = newActiveEditor.uri
    const moduleId = ViewletMap.getModuleId(uri)
    const uid = newActiveEditor.uid
    const instance = ViewletManager.create(ViewletModule.load, moduleId, state.uid, uri, x, y, width, contentHeight)
    // @ts-ignore
    instance.show = false
    instance.setBounds = false
    instance.uid = uid
    const focus = true
    // @ts-ignore
    const instanceCommands = await ViewletManager.load(instance, focus, false, {})
    commands.push(...instanceCommands)
    commands.push(['Viewlet.setBounds', uid, x, state.tabHeight, width, contentHeight])
    commands.push(['Viewlet.append', state.uid, uid])
  }
  return {
    newState: {
      ...state,
      editors: newEditors,
      activeIndex: focusedIndex,
    },
    commands,
  }
}
