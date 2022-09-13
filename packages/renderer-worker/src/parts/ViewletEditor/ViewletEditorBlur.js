export const state = {
  blurListeners: [],
}

export const editorBlur = (editor) => {
  // for (const listener of state.blurListeners) {
  //   listener(editor)
  // }
  // TODO save on blur
  // Command.execute(/* Main.save */ 89)
  return {
    ...editor,
    focused: false,
  }
}

export const registerListener = (fn) => {
  state.blurListeners.push(fn)
}

export const removeListener = (fn) => {
  state.blurListeners.splice(state.blurListeners.indexOf(fn), 1)
}
