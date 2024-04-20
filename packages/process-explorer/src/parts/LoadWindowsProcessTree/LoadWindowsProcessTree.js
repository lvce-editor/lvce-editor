import * as IsDlOpenError from '../IsDlOpenError/IsDlOpenError.js'
import { VError } from '../VError/VError.js'

export const loadWindowProcessTree = async () => {
  try {
    return await import('@vscode/windows-process-tree')
  } catch (error) {
    if (IsDlOpenError.isDlOpenError(error)) {
      throw new VError(
        `Failed to load windows process tree: The native module "@vscode/windows-process-tree" is not compatible with this node version and must be compiled against a matching electron version using electron-rebuild`,
      )
    }
    throw new VError(error, `Failed to load windows process tree`)
  }
}
