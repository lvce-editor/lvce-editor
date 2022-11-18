import { VError } from '../VError/VError.js'

export const state = {
  commands: Object.create(null),
}

export const registerCommand = (command) => {
  try {
    if (!command) {
      throw new Error('command is not defined')
    }
    if (!command.id) {
      throw new Error('command is missing id')
    }
    if (!command.execute) {
      throw new Error('command is missing execute function')
    }
    state.commands[command.id] = command
  } catch (error) {
    throw new VError(error, `Failed to register command`)
  }
}

export const executeCommand = async (id, ...args) => {
  try {
    const command = state.commands[id]
    if (!command) {
      throw new Error(`command ${id} not found`)
    }
    const results = await command.execute(...args)
    return results
  } catch (error) {
    if (error && error.isExpected) {
      throw error
    }
    throw new VError(error, `Failed to execute command`)
  }
}

export const reset = () => {
  state.commands = Object.create(null)
}
