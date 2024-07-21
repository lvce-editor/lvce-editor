const state = {
  commands: Object.create(null),
}

const registerCommand = (key: string, fn: any) => {
  state.commands[key] = fn
}

export const registerCommands = (commandMap: any) => {
  for (const [key, value] of Object.entries(commandMap)) {
    registerCommand(key, value)
  }
}

export const getCommand = (key: string) => {
  return state.commands[key]
}
