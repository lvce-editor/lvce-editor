import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
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
  for (const editor of state.editors) {
    if (editor.uri === uri) {
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

  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, moduleId, ViewletModuleId.Main, uri, x, y, width, height)
  instance.uid = instanceUid
  const oldActiveIndex = state.activeIndex
  const label = PathDisplay.getLabel(uri)
  const title = PathDisplay.getTitle(uri)
  state.editors.push({ uri, uid: instanceUid, label, title })
  state.activeIndex = state.editors.length - 1
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ state.uid,
    /* method */ 'openViewlet',
    /* tabLabel */ label,
    /* tabTitle */ title,
    /* oldActiveIndex */ oldActiveIndex
  )
  // @ts-ignore
  instance.show = false
  instance.setBounds = false
  // @ts-ignore
  const commands = await ViewletManager.load(instance, focus)
  // if (commands[0].includes(ViewletModuleId.Error)) {
  //   commands.push(['Viewlet.appendViewlet', state.uid, ViewletModuleId.Error])
  // } else {
  commands.push(['Viewlet.appendViewlet', state.uid, instanceUid || moduleId])
  if (focus) {
    commands.push(['Viewlet.focus', instanceUid])
  }
  // }
  if (!ViewletStates.hasInstance(moduleId)) {
    return {
      newState: state,
      commands,
    }
  }
  const actualUri = ViewletStates.getState(moduleId).uri
  const index = state.editors.findIndex((editor) => editor.uid === instanceUid)
  state.editors[index].uri = actualUri
  return {
    newState: {
      ...state,
      editors: [...state.editors],
    },
    commands,
  }
}
