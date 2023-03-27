import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const state = {
  blurListeners: [],
}

export const blur = (editor) => {
  // for (const listener of state.blurListeners) {
  //   listener(editor)
  // }
  // TODO save on blur
  // Command.execute(/* Main.save */ 89)
  const newEditor = {
    ...editor,
    focused: false,
  }
  RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, EditorFunctionType.HandleEditorBlur)
  return newEditor
}

export const registerListener = (fn) => {
  state.blurListeners.push(fn)
}

export const removeListener = (fn) => {
  state.blurListeners.splice(state.blurListeners.indexOf(fn), 1)
}
