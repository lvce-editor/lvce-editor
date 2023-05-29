import { execa } from 'execa'
import * as Assert from '../Assert/Assert.js'

/**
 * @deprecated use node api directly
 */
export const exec = async (file, args, options) => {
  Assert.string(file)
  Assert.array(args)
  const { stdout, stderr, exitCode } = await execa(file, args, options)
  return {
    stdout,
    stderr,
    exitCode,
  }
}
