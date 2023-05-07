import * as CommandState from '../CommandState/CommandState.js'

export const execute = (command, ...args) => {
  const fn = CommandState.getCommand(command)
  return fn(...args)
}
