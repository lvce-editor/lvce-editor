import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const openUri = async (state, uri, focus = true, options = {}) => {
  Assert.object(state)
  Assert.string(uri)
  const x = state.x
  const y = state.y + state.tabHeight
  const width = state.width
  const height = state.height - state.tabHeight
  const moduleId = ViewletMap.getModuleId(uri)
  const instanceUid = Id.create()
  const allCommands = []
  const tabLabel = PathDisplay.getLabel(uri)
  const tabTitle = PathDisplay.getTitle(uri)
  const instance = ViewletManager.create(ViewletModule.load, moduleId, ViewletModuleId.Main, uri, x, y, width, height)
  instance.uid = instanceUid
  // @ts-ignore
  instance.show = false
  instance.setBounds = false

  // @ts-ignore
  const commands = await ViewletManager.load(instance, focus)
  allCommands.push(...commands)
  allCommands.push(['Viewlet.setBounds', instanceUid, x, state.tabHeight, width, state.height - state.tabHeight])
  if (state.grid.length >= 1) {
    console.log('existing')
    const previousItem = state.grid[0]
    const previousEditors = previousItem.editors
    const leafItem = {
      type: 'leaf',
      size: 0,
      instanceUid,
      tabsUid: previousItem.tabsUid,
      editors: [...previousEditors, { uri, label: tabLabel, title: tabTitle }],
      childCount: 0,
      focusedIndex: previousEditors.length,
      instanceId: moduleId,
    }
    state.grid[0] = leafItem
    console.log({ previousEditors })
    allCommands.push(['Viewlet.send', previousItem.tabsUid, 'setTabs', leafItem.editors])
    allCommands.push(['Viewlet.send', previousItem.tabsUid, 'setFocusedIndex', leafItem.focusedIndex, previousEditors.length])
    const disposeCommands = Viewlet.disposeFunctional(previousItem.instanceUid)
    allCommands.push(...disposeCommands)
    allCommands.push(['Viewlet.append', state.uid, instanceUid || moduleId])
    return {
      newState: {
        ...state,
      },
      commands: allCommands,
    }
  }
  console.log('other', state.grid)
  for (const editor of state.editors) {
    if (editor.uri === uri) {
      console.log('shortcut')
      const childUid = Id.create()
      // TODO if the editor is already open, nothing needs to be done
      const instance = ViewletManager.create(ViewletModule.load, moduleId, ViewletModuleId.Main, uri, x, y, width, height)
      instance.show = false
      instance.setBounds = false
      instance.uid = childUid
      // @ts-ignore
      const commands = await ViewletManager.load(instance, focus, false, options)
      commands.push(['Viewlet.appendViewlet', state.uid, childUid])
      return {
        newState: state,
        commands,
      }
    }
  }

  const tabsUid = Id.create()
  const leafItem = {
    type: 'leaf',
    size: 0,
    instanceUid,
    tabsUid,
    editors: [],
    childCount: 0,
    instanceId: moduleId,
  }
  state.grid.push(leafItem)

  const oldActiveIndex = state.activeIndex
  state.editors.push({ uri, uid: instanceUid })
  state.activeIndex = state.editors.length - 1

  await RendererProcess.invoke('Viewlet.loadModule', ViewletModuleId.MainTabs)
  allCommands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsUid])
  allCommands.push([
    'Viewlet.send',
    tabsUid,
    'setTabs',
    [
      {
        label: tabLabel,
        title: tabTitle,
      },
    ],
  ])
  allCommands.push(['Viewlet.setBounds', tabsUid, x, 0, width, state.tabHeight])
  // if (commands[0].includes(ViewletModuleId.Error)) {
  //   commands.push(['Viewlet.appendViewlet', state.uid, ViewletModuleId.Error])
  // } else {
  allCommands.push(['Viewlet.append', state.uid, tabsUid])
  allCommands.push(['Viewlet.append', state.uid, instanceUid || moduleId])
  if (focus) {
    allCommands.push(['Viewlet.focus', instanceUid])
  }
  // }
  if (!ViewletStates.hasInstance(instanceUid)) {
    return {
      newState: state,
      commands: allCommands,
    }
  }
  const actualUri = ViewletStates.getState(instanceUid).uri
  const index = state.editors.findIndex((editor) => editor.uid === instanceUid)
  state.editors[index].uri = actualUri
  console.log({ allCommands })
  return {
    newState: state,
    commands: allCommands,
  }
}
