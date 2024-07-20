export const state = {
  blurListeners: [],
}

// @ts-ignore
export const handleBlur = (editor) => {
  // for (const listener of state.blurListeners) {
  //   listener(editor)
  // }
  // TODO save on blur
  // Command.execute(/* Main.save */ 89)
  const newEditor = {
    ...editor,
    focused: false,
  }
  return newEditor
}

// @ts-ignore
export const registerListener = (fn) => {
  // @ts-ignore
  state.blurListeners.push(fn)
}

// @ts-ignore
export const removeListener = (fn) => {
  // @ts-ignore
  state.blurListeners.splice(state.blurListeners.indexOf(fn), 1)
}
