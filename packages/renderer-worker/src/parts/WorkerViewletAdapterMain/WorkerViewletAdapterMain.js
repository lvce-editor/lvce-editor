import * as Viewlet from '../Viewlet/Viewlet.js'
import * as SaveState from '../SaveState/SaveState.js'
import { getKeyBindings } from '../ViewletMain/ViewletMainKeyBindings.js'
import { getQuickPickMenuEntries, menus } from '../ViewletMain/ViewletMainMenuEntries.js'
import { openUri } from '../ViewletMain/ViewletMainOpenUri.ts'
import { resize } from '../ViewletMain/ViewletMainResize.js'
import { wrapMainAreaCommand } from '../WrapMainAreaCommand/WrapMainAreaCommand.ts'

const executeEditorCommand = async (editor, commandId) => {
  await Viewlet.executeViewletCommand(editor.uid, commandId)
  return editor
}

const focus = async (state) => {
  const { editors, activeIndex } = state
  if (activeIndex === -1) {
    return state
  }
  await executeEditorCommand(editors[activeIndex], 'focus')
  return state
}

const openKeyBindings = (state) => {
  return openUri(state, 'app://keybindings')
}

const openEditorWithType = async () => {
  // TODO resolve custom editors from extension host
  // then open extension host custom editor or normal editor
}

const saveWithoutFormatting = wrapMainAreaCommand('saveWithoutFormatting')

export const getHotReloadSavedState = async (state, _saveState, worker) => {
  const { layout } = await worker.invoke('MainArea.getComponentState', state.uid)
  for (const group of layout.groups) {
    for (const tab of group.tabs) {
      if (tab.editorUid !== -1 && tab.editorInput?.type === 'editor') {
        await SaveState.saveViewletState(tab.editorUid)
      }
    }
  }
  return { layout, hotReload: true }
}

export const extendModule = (workerViewlet, { worker }) => ({
  dispose({ uid }) {
    return worker.invoke('MainArea.dispose', uid)
  },
  focus,
  getKeyBindings,
  getQuickPickMenuEntries,
  async hotReload(state) {
    const savedState = await getHotReloadSavedState(state, undefined, worker)
    return workerViewlet.loadContentForHotReload(state, savedState)
  },
  menus,
  openEditorWithType,
  openKeyBindings,
  resize,
  saveWithoutFormatting,
})

const wrapReturnValueCommand = (command, worker) => {
  const fn = ({ uid }, ...args) => {
    return worker.invoke(`MainArea.${command}`, uid, ...args)
  }
  fn.returnValue = true
  return fn
}

export const wrapCommand = (command, _defaultWrapCommand, { worker }) => {
  if (command === 'hasDirtyTabs') {
    return wrapReturnValueCommand(command, worker)
  }
  return wrapMainAreaCommand(command)
}

export const extendCommands = (Commands, _workerViewlet, { worker }) => {
  Commands.loadContentLater = async (state) => {
    await worker.invoke('MainArea.loadContentLater', state.uid)
    return state
  }
}
