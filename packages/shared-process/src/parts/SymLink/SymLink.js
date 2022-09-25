import { symlink } from 'node:fs/promises'
import { FileSystemError } from '../Error/FileSystemError.js'

// TODO maybe move this to FileSystem module

export const createSymLink = async (target, path) => {
  try {
    await symlink(target, path)
  } catch (error) {
    throw new FileSystemError(
      error,
      `Failed to create symbolic link from ${target} to ${path}`
    )
  }
}
