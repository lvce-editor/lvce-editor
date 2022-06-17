const { execa } = require('execa')

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import('execa').Options} options
 * @returns
 */
export const exec = async (command, args, options) => {
  const { stdout, stderr } = await execa(command, args, options)
  return {
    stdout,
    stderr,
  }
}
