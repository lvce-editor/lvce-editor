import * as Command from '../Command/Command.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as LifeCyclePhase from '../LifeCyclePhase/LifeCyclePhase.js'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import { openUri } from './ViewletMainOpenUri.ts'

const hydrateLazy = async () => {
  // TODO this should be in extension host
  await Command.execute(/* EditorDiagnostics.hydrate */ 'EditorDiagnostics.hydrate')
}

export const create = (id, uri, x, y, width, height) => {
  return {
    groups: [],
    activeGroupIndex: -1,
    x,
    y,
    width,
    height,
    uid: id,
    moduleId: ViewletModuleId.Main,
    tabHeight: 35,
    dragOverlayX: 0,
    dragOverlayY: 0,
    dragOverlayWidth: 0,
    dragOverlayHeight: 0,
    dragOverlayVisible: false,
    tabsUid: -1,
    pendingUid: 0,
    tabFontFamily: 'system-ui, Ubuntu, Droid Sans, sans-serif',
    tabFontSize: 13,
    tabLetterSpacing: 0,
    tabFontWeight: 400,
    tabScrollBarVisible: false,
  }
}

export const saveState = async (state) => {
  const saved = await MainAreaWorker.invoke('MainArea.saveState', state.uid)
  return saved
}

const mainAreaWorkerEnabled = true

export const loadContent = async (state, savedState) => {
  if (mainAreaWorkerEnabled) {
    await MainAreaWorker.invoke('MainArea.create', state.uid, '', state.x, state.y, state.width, state.height, null)
    await MainAreaWorker.invoke('MainArea.loadContent', state.uid, savedState)
    const diffResult = await MainAreaWorker.invoke('MainArea.diff2', state.uid)
    const commands = await MainAreaWorker.invoke('MainArea.render2', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }

  // TODO get restored editors from saved state
  // @ts-ignore
  LifeCycle.once(LifeCyclePhase.Twelve, hydrateLazy)
  await RendererProcess.invoke('Viewlet.loadModule', ViewletModuleId.MainTabs)
  return {
    ...state,
  }
}

export const hotReload = async (state) => {
  await MainAreaWorker.invoke('MainArea.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await MainAreaWorker.invoke('MainArea.loadContent', state.uid, {})
  const diffResult = await MainAreaWorker.invoke('MainArea.diff2', state.uid)
  const commands = await MainAreaWorker.invoke('MainArea.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}

const executeEditorCommand = async (editor, commandId) => {
  const uid = editor.uid
  await Viewlet.executeViewletCommand(uid, commandId)
  return editor
}

const focusEditor = (editor) => {
  return executeEditorCommand(editor, 'focus')
}

export const focus = async (state) => {
  const { editors, activeIndex } = state
  if (activeIndex === -1) {
    return state
  }
  const editor = editors[activeIndex]
  await focusEditor(editor)
  return state
}

export const openEditorWithType = async () => {
  // TODO resolve custom editors from extension host
  // then open extension host custom editor or normal editor
}

export const saveWithoutFormatting = async () => {
  console.warn('not implemented')
}

export const dispose = () => {}

export const openKeyBindings = async (state) => {
  const keyBindingsUri = 'app://keybindings'
  return openUri(state, keyBindingsUri)
}
