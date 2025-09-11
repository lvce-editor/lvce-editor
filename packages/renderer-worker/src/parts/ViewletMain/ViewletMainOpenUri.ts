import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.js'
import * as MeasureTabWidth from '../MeasureTabWidth/MeasureTabWidth.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as TabFlags from '../TabFlags/TabFlags.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletMainFocusIndex from './ViewletMainFocusIndex.js'

export const openUri = async (state, uri, focus = true, { preview = false, ...context } = {}) => {
  Assert.object(state)
  Assert.string(uri)
  const { tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing, groups, activeGroupIndex, tabHeight } = state
  const x = state.x
  const y = state.y + tabHeight
  const width = state.width
  const contentHeight = state.height - tabHeight
  // @ts-ignore
  const moduleId = await ViewletMap.getModuleId(uri, context.opener)
  let activeGroup = groups[activeGroupIndex]
  activeGroup ||= {
    uid: Id.create(),
    editors: [],
    activeIndex: -1,
    focusedIndex: -1,
    tabsUid: Id.create(),
    x,
    y: 0,
    width,
    height: state.height,
  }
  const { editors, activeIndex } = activeGroup

  const previousEditor = editors[activeIndex]
  let disposeCommands
  // @ts-ignore
  if (previousEditor && previousEditor.uri === uri && previousEditor.opener === context.opener) {
    return {
      newState: state,
      commands: [],
    }
  }
  for (let i = 0; i < editors.length; i++) {
    const editor = editors[i]
    if (editor.uri === uri) {
      // @ts-ignore
      if (editor.opener === context.opener) {
        return ViewletMainFocusIndex.focusIndex(state, i)
      }
    }
  }
  // TODO editor needs to be disposed when closing
  //  other tabs and closing all tabs
  if (previousEditor) {
    const previousUid = previousEditor.uid
    disposeCommands = Viewlet.hideFunctional(previousUid)
  }
  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, moduleId, state.uid, uri, activeGroup.x, y, activeGroup.width, contentHeight)
  instance.uid = instanceUid
  // const oldActiveIndex = state.activeIndex
  const tabLabel = PathDisplay.getLabel(uri)
  const tabWidth = MeasureTabWidth.measureTabWidth(tabLabel, tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing)
  const tabTitle = PathDisplay.getTitle(uri)
  const icon = await PathDisplay.getFileIcon(uri)
  const newEditor = {
    uri,
    uid: instanceUid,
    label: tabLabel,
    title: tabTitle,
    icon,
    tabWidth,
    flags: TabFlags.Preview,
    moduleId,
  }
  const newEditors = [...activeGroup.editors, newEditor]
  const newActiveIndex = newEditors.length - 1
  const newGroup = { ...activeGroup, editors: newEditors, activeIndex: newActiveIndex }
  const newGroups = [...groups.slice(0, activeGroupIndex), newGroup, ...groups.slice(activeGroupIndex + 1)]
  // @ts-ignore
  instance.show = false
  instance.setBounds = false
  ViewletStates.setState(state.uid, {
    ...state,
    activeGroupIndex: 0,
    groups: newGroups,
    pendingUid: instanceUid,
  })
  if (context) {
    instance.args = [context]
  }
  // @ts-ignore
  const commands = await ViewletManager.load(instance, focus)
  commands.push(['Viewlet.setBounds', instanceUid, activeGroup.x, tabHeight, activeGroup.width, contentHeight])
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
  const latestState = ViewletStates.getState(state.uid)
  const latestPendingUid = latestState.pendingUid
  if (latestPendingUid !== instanceUid) {
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
      groups: newGroups,
    },
    commands,
  }
}
