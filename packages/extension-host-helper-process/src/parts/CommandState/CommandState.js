export const state = {
  commands: Object.create(null),
  /**
   * @type {any}
   */
  execute: undefined,
}

export const registerCommand = (key, fn) => {
  state.commands[key] = fn
}

export const registerCommands = (commandMap) => {
  for (const [key, value] of Object.entries(commandMap)) {
    registerCommand(key, value)
  }
}

export const getCommand = (key) => {
  const { commands, execute } = state
  if (key in commands) {
    return commands[key]
  }
  if (execute) {
    return (...args) => {
      return execute(key, ...args)
    }
  }
  return undefined
}

export const setExecute = (fn) => {
  state.execute = fn
}
