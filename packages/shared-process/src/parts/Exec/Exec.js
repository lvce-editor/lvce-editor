import * as childProcess from 'child_process'

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @returns
 */
export const exec = async (command, args) => {
  childProcess.execFileSync(command, args)
}
