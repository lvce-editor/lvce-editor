import * as Command from '@lvce-editor/command'
import * as Assert from '../Assert/Assert.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import { VError } from '../VError/VError.js'

export const loadFile = async (path) => {
  try {
    Assert.string(path)
    const module = await ImportScript.importScript(path)
    if (module && module.commandMap) {
      const commandMap = module.commandMap
      Command.register(commandMap)
    } else if (module && module.execute) {
      throw new Error(`execute function is not supported anymore. Use commandMap instead`)
    } else {
      throw new Error(`missing export const execute function`)
    }
  } catch (error) {
    throw new VError(error, `Failed to load ${path}`)
  }
}
