import VError from 'verror'
import * as Nodefs from 'node:fs/promises'

export const symlink = async (from, to) => {
  try {
    await Nodefs.symlink(from, to)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to create symlink from ${from} to ${to}`)
  }
}
