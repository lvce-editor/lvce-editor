import * as CommandState from '../CommandState/CommandState.js'
import * as ProcessName from '../ProcessName/ProcessName.js'

export const execute = (command, ...args) => {
  const fn = CommandState.getCommand(command)
  if (!fn) {
    throw new Error(`[${ProcessName.processName}] command not found ${command}`)
  }
  return fn(...args)
}
