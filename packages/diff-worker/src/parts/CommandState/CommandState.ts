const commands = Object.create(null)

export const registerCommand = (key: string, fn: any) => {
  commands[key] = fn
}

export const registerCommands = (commandMap: any) => {
  for (const [key, value] of Object.entries(commandMap)) {
    registerCommand(key, value)
  }
}

export const getCommand = (key: string) => {
  return commands[key]
}
