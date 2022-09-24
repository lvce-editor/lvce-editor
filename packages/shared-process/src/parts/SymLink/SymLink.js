import { symlink } from 'node:fs/promises'
import VError from 'verror'

// TODO maybe move this to FileSystem module

export const createSymLink = async (target, path) => {
  try {
    await symlink(target, path)
  } catch (error) {
    throw new VError(
      error,
      `Failed to create symbolic link from ${target} to ${path}`
    )
  }
}
