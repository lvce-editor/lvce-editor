import * as Assert from '../Assert/Assert.js'
import * as GetExtensionAbsolutePath from '../GetExtensionAbsolutePath/GetExtensionAbsolutePath.js'
import * as GetExtensionId from '../GetExtensionId/GetExtensionId.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import * as IsImportError from '../IsImportError/IsImportError.js'
import * as Timeout from '../Timeout/Timeout.js'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'
import { VError } from '../VError/VError.js'

const activationTimeout = 10_000

const rejectAfterTimeout = async (timeout, token) => {
  await Timeout.sleep(timeout)
  if (token.finished) {
    return
  }
  throw new Error(`activation timeout of ${timeout}ms exceeded`)
}

export const activate = async (extension) => {
  try {
    Assert.string(extension.path)
    Assert.string(extension.browser)
    const absolutePath = GetExtensionAbsolutePath.getExtensionAbsolutePath(extension.isWeb, extension.path, extension.browser, location.origin)
    const module = await ImportScript.importScript(absolutePath)
    try {
      const token = {
        finished: false,
      }
      await Promise.race([module.activate(), rejectAfterTimeout(activationTimeout, token)])
      token.finished = true
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
