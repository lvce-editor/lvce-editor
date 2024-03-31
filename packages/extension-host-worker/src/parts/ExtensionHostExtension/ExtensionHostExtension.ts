import * as Assert from '../Assert/Assert.ts'
import * as CancelToken from '../CancelToken/CancelToken.ts'
import * as GetExtensionId from '../GetExtensionId/GetExtensionId.ts'
import * as ImportScript from '../ImportScript/ImportScript.ts'
import * as IsImportError from '../IsImportError/IsImportError.ts'
import * as Timeout from '../Timeout/Timeout.ts'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.ts'
import { VError } from '../VError/VError.ts'

const activationTimeout = 10_000

const rejectAfterTimeout = async (timeout, token) => {
  await Timeout.sleep(timeout)
  if (CancelToken.isCanceled(token)) {
    return
  }
  throw new Error(`Activation timeout of ${timeout}ms exceeded`)
}

export const activate = async (extension, absolutePath) => {
  try {
    Assert.string(extension.path)
    Assert.string(extension.browser)
    Assert.string(absolutePath)
    const module = await ImportScript.importScript(absolutePath)
    const token = CancelToken.create()
    try {
      await Promise.race([module.activate(extension), rejectAfterTimeout(activationTimeout, token)])
    } catch (error) {
      if (IsImportError.isImportError(error)) {
        const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(absolutePath, error)
        throw new Error(actualErrorMessage)
      }
      throw error
    } finally {
      CancelToken.cancel(token)
    }
  } catch (error) {
    const id = GetExtensionId.getExtensionId(extension)
    throw new VError(error, `Failed to activate extension ${id}`)
  }
  // console.info('activated', path)
}
