import { VError } from '../VError/VError.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export const loadWindowProcessTree = async () => {
  try {
    // @ts-ignore
    return await import('@vscode/windows-process-tree')
  } catch (error) {
    if (error && error instanceof Error && 'code' in error && error.code === ErrorCodes.ERR_DLOPEN_FAILED) {
      throw new VError(
        `Failed to load windows process tree: The native module "windows-process-tree" is not compatible with this node version and must be compiled against a matching electron version using electron-rebuild`
      )
    }
    throw new VError(error, `Failed to load windows process tree`)
  }
}
