import * as Viewlet from '../Viewlet/Viewlet.js'
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

const saveWithoutFormatting = async () => {
  console.warn('not implemented')
}

export const extendModule = (workerViewlet) => ({
  dispose() {},
  focus,
  getKeyBindings,
  getQuickPickMenuEntries,
  hotReload(state) {
    return workerViewlet.loadContent(state, {})
  },
  menus,
  openEditorWithType,
  openKeyBindings,
  resize,
  saveWithoutFormatting,
})

export const wrapCommand = (command) => {
  return wrapMainAreaCommand(command)
}
