export const state = {
  commands: Object.create(null),
}

// @ts-ignore
export const registerCommand = (key, fn) => {
  state.commands[key] = fn
}

// @ts-ignore
export const registerCommands = (commandMap) => {
  for (const [key, value] of Object.entries(commandMap)) {
    registerCommand(key, value)
  }
}

// @ts-ignore
export const getCommand = (key) => {
  return state.commands[key]
}
