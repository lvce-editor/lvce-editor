import * as childProcess from 'child_process'
import { fileURLToPath } from 'url'
import * as LaunchDetachedUpdate from '../LaunchDetachedUpdate/LaunchDetachedUpdate.ts'

/**
 *
 * @param {string} uri
 * @param {string[]} args
 * @returns
 */
export const exec = async (uri: any, args: any, options: { detached?: boolean } = {}): Promise<any> => {
  const path = fileURLToPath(uri)
  // The update worker requests a detached NSIS installer. Waiting synchronously
  // ties it to the application that the installer must close and replace.
  if (options.detached) {
    await LaunchDetachedUpdate.launch(path, args)
    return
  }
  childProcess.execFileSync(path, args)
}
