const kDispose = 'Viewlet.dispose'
const kSetCss = 'Viewlet.setCss'
const kSetPatches = 'Viewlet.setPatches'

export const state = {
  /** @type {Map<string | number, string>} */
  cssTexts: new Map(),
}

const normalizeSetCss = (command) => {
  const id = command[1]
  const newText = command[2]
  if ((typeof id !== 'string' && typeof id !== 'number') || typeof newText !== 'string') {
    return command
  }
  const oldText = state.cssTexts.get(id)
  if (oldText === newText) {
    return undefined
  }
  state.cssTexts.set(id, newText)
  return command
}

const normalizeCommand = (command) => {
  if (!Array.isArray(command)) {
    return command
  }
  if (command[0] === kSetPatches && Array.isArray(command[2]) && command[2].length === 0) {
    return undefined
  }
  if (command[0] === kSetCss) {
    return normalizeSetCss(command)
  }
  if (command[0] === kDispose) {
    state.cssTexts.delete(command[1])
  }
  return command
}

export const normalizeCommands = (commands) => {
  const normalized = []
  for (const command of commands) {
    const normalizedCommand = normalizeCommand(command)
    if (normalizedCommand) {
      normalized.push(normalizedCommand)
    }
  }
  return normalized
}

export const getCssText = (id) => {
  return state.cssTexts.get(id)
}

export const setCssText = (id, text) => {
  state.cssTexts.set(id, text)
}

export const removeCssText = (id) => {
  state.cssTexts.delete(id)
}

export const reset = () => {
  state.cssTexts.clear()
}
