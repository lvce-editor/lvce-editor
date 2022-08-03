export const state = {
  blurListeners: [],
}

export const editorBlur = (editor) => {
  // for (const listener of state.blurListeners) {
  //   listener(editor)
  // }
  // TODO save on blur
  // Command.execute(/* Main.save */ 89)
  return editor
}

export const registerListener = (fn) => {
  // @ts-ignore
  state.blurListeners.push(fn)
}

export const removeListener = (fn) => {
  // @ts-ignore
  state.blurListeners.splice(state.blurListeners.indexOf(fn), 1)
}
