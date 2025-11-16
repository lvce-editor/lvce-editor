import { execFileSync } from 'node:child_process'

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @returns
 */
export const exec = async (command, args) => {
  execFileSync(command, args)
}
