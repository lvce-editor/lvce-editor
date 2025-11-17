import * as childProcess from 'child_process'
import { fileURLToPath } from 'url'

/**
 *
 * @param {string} uri
 * @param {string[]} args
 * @returns
 */
export const exec = async (uri, args) => {
  const path = fileURLToPath(uri)
  childProcess.execFileSync(path, args)
}
