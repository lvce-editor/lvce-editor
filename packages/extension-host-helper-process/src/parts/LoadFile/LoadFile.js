import * as Command from '@lvce-editor/command'
import * as Assert from '../Assert/Assert.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.js'
import { VError } from '../VError/VError.js'

export const loadFile = async (path) => {
  try {
    Assert.string(path)
    if (!CommandMapRef.commandMapRef['LoadFile.loadFile']) {
      throw new Error('a module has already been loaded')
    }
    delete CommandMapRef.commandMapRef['LoadFile.loadFile']
    Command.register({
      'LoadFile.loadFile'() {
        throw new Error('a module has already been loaded')
      },
    })
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
