import { VError } from '../VError/VError.js'
import * as CommandState from '../CommandState/CommandState.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import * as Assert from '../Assert/Assert.js'

export const loadFile = async (path) => {
  try {
    Assert.string(path)
    const module = await ImportScript.importScript(path)
    if (module && module.commandMap) {
      const commandMap = module.commandMap
      CommandState.registerCommands(commandMap)
    } else if (module && module.execute) {
      CommandState.setExecute(module.execute)
    } else {
      throw new Error(`missing export const execute function`)
    }
  } catch (error) {
    throw new VError(error, `Failed to load ${path}`)
  }
}
