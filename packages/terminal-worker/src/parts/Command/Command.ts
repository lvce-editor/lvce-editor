import * as CommandState from '../CommandState/CommandState.ts'
import * as ProcessName from '../ProcessName/ProcessName.ts'

export const execute = (command, ...args) => {
  const fn = CommandState.getCommand(command)
  console.log({ command, args })
  if (!fn) {
    throw new Error(`[${ProcessName.processName}] command not found ${command}`)
  }
  return fn(...args)
}
