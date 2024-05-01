import symlinkDir from 'symlink-dir'

export const createSymLink = async (target, path) => {
  await symlinkDir(target, path)
}
