export const state = {
  commandMap: Object.create(null),
}

export const registerCommand = (command) => {
  state.commandMap[command.id] = command.execute
}

export const unregisterCommand = (command) => {
  if (!(command.id in state.commandMap)) {
    throw new Error('not registered')
  }
  delete state.commandMap[command.id]
}

export const executeCommand = (commandId, ...args) => {
  if (!(commandId in state.commandMap)) {
    // console.log(state.commandMap)
    throw new Error('not registered')
  }
  return state.commandMap[commandId](...args)
}
