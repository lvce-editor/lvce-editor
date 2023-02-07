import * as Assert from '../Assert/Assert.js'
import * as GetExtensionAbsolutePath from '../GetExtensionAbsolutePath/GetExtensionAbsolutePath.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import * as IsImportError from '../IsImportError/IsImportError.js'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'
import { VError } from '../VError/VError.js'

const baseName = (path) => {
  const slashIndex = path.lastIndexOf('/')
  return path.slice(slashIndex + 1)
}

const getId = (extension) => {
  if (extension && extension.id) {
    return extension.id
  }
  if (extension && extension.path) {
    return baseName(extension.path)
  }
  return '<unknown>'
}

export const activate = async (extension) => {
  try {
    Assert.string(extension.path)
    Assert.string(extension.browser)
    const absolutePath = GetExtensionAbsolutePath.getExtensionAbsolutePath(extension.isWeb, extension.path, extension.browser, location.origin)
    const module = await ImportScript.importScript(absolutePath)
    try {
      await module.activate()
    } catch (error) {
      if (IsImportError.isImportError(error)) {
        const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(absolutePath, error)
        throw new Error(actualErrorMessage)
      }
      throw error
    }
  } catch (error) {
    const id = getId(extension)
    throw new VError(error, `Failed to activate extension ${id}`)
  }
  // console.info('activated', path)
}
