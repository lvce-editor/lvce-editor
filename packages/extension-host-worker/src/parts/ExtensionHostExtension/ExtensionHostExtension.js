import * as Assert from '../Assert/Assert.js'
import { VError } from '../VError/VError.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import * as IsUnhelpfulImportError from '../IsUnhelpfulImportError/IsUnhelpfulImportError.js'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'

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
    const absolutePath = getAbsolutePath(extension.isWeb, extension.path, extension.browser, location.origin)
    const module = await ImportScript.importScript(absolutePath)
    try {
      await module.activate()
    } catch (error) {
      if (IsUnhelpfulImportError.isUnhelpfulImportError(error)) {
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
