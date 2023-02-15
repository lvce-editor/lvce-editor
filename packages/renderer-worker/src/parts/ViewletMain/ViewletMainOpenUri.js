import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

const getTabTitle = (uri) => {
  const homeDir = Workspace.getHomeDir()
  // TODO tree shake this out in web
  if (homeDir && uri.startsWith(homeDir)) {
    return `~${uri.slice(homeDir.length)}`
  }
  return uri
}

export const openUri = async (state, uri, focus = true, options = {}) => {
  Assert.object(state)
  Assert.string(uri)
  const x = state.x
  const { tabHeight } = state
  const y = state.y + tabHeight
  const width = state.width
  const height = state.height - tabHeight
  const id = ViewletMap.getId(uri)
  const tabsUid = Id.create()
  const instanceUid = Id.create()

  for (const editor of state.grid) {
    if (editor.uri === uri) {
      console.log('found existing editor')
      // TODO if the editor is already open, nothing needs to be done
      const instance = ViewletManager.create(ViewletModule.load, id, ViewletModuleId.Main, uri, x, y, width, height)
      // @ts-ignore

      await ViewletManager.load(instance, focus, false, options)
      return state
    }
  }

  const instance = ViewletManager.create(ViewletModule.load, id, ViewletModuleId.Main, uri, x, tabHeight, width, height)
  instance.uid = instanceUid
  instance.show = false
  const groupItem = {
    x,
    y: state.y,
    width,
    height,
    childCount: 1,
    uri,
    uid: tabsUid,
    id: instance.id,
  }
  const leafItem = {
    x,
    y: y,
    width,
    height: height,
    childCount: 0,
    uri,
    uid: instanceUid,
    id: instance.id,
  }
  state.grid.push(groupItem, leafItem)
  state.activeIndex = state.grid.length - 1
  const tabLabel = Workspace.pathBaseName(uri)
  const tabTitle = getTabTitle(uri)
  const allCommands = []
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
  allCommands.push(['Viewlet.setBounds', tabsUid, x, 0, width, tabHeight])
  // @ts-ignore
  const commands = await ViewletManager.load(instance, false)
  allCommands.push(...commands)
  allCommands.push([/* Viewlet.append */ 'Viewlet.appendCustom', /* parentId */ ViewletModuleId.Main, /* method */ 'appendTabs', /* id  */ tabsUid])
  allCommands.push([
    /* Viewlet.append */ 'Viewlet.appendCustom',
    /* parentId */ ViewletModuleId.Main,
    /* method */ 'appendContent',
    /* id  */ instanceUid,
  ])
  if (focus) {
    allCommands.push(...Viewlet.getFocusCommands(instance.id, instanceUid))
  }
  await RendererProcess.invoke(/* Viewlet.sendMultiple */ 'Viewlet.sendMultiple', /* commands */ allCommands)
  if (!ViewletStates.hasInstance(id)) {
    return state
  }
  console.log({ ...ViewletStates.state.instances })
  return state
}
