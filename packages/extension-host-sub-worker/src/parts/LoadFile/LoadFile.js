import * as Assert from '../Assert/Assert.js'
import * as CommandState from '../CommandState/CommandState.js'
import * as ImportScript from '../ImportScript/ImportScript.js'

export const loadFile = async (path) => {
  Assert.string(path)
  const module = await ImportScript.importScript(path)
  if (module && module.commandMap) {
    const commandMap = module.commandMap
    CommandState.registerCommands(commandMap)
  } else {
    throw new Error(`missing commandMap export`)
  }
}
