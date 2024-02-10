import * as CommandState from '../CommandState/CommandState.js'

export const execute = (command, ...args) => {
  const fn = CommandState.getCommand(command)
  if (!fn) {
    throw new Error(`command not found ${command}`)
  }
  return fn(...args)
}
