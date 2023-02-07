import * as Assert from '../Assert/Assert.js'
import * as GetExtensionId from '../GetExtensionId/GetExtensionId.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import * as IsImportError from '../IsImportError/IsImportError.js'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'
import { VError } from '../VError/VError.js'

const getAbsolutePath = (isWeb, path, relativePath, origin) => {
  if (path.startsWith('http')) {
    if (path.endsWith('/')) {
      return new URL(relativePath, path).toString()
    }
    return new URL(relativePath, path + '/').toString()
  }
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  if (isWeb) {
    return path + '/' + relativePath
  }
  return new URL('/remote' + path + '/' + relativePath, origin).toString()
}

export const activate = async (extension) => {
  try {
    Assert.string(extension.path)
    Assert.string(extension.browser)
    const absolutePath = getAbsolutePath(extension.isWeb, extension.path, extension.browser, location.origin)
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
    const id = GetExtensionId.getExtensionId(extension)
    throw new VError(error, `Failed to activate extension ${id}`)
  }
  // console.info('activated', path)
}
