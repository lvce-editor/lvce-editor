import * as Path from '../Path/Path.ts'

export const toAbsolutePaths = (path, dirents) => {
  const absolutePaths = []
  for (const dirent of dirents) {
    absolutePaths.push(Path.join(path, dirent))
  }
  return absolutePaths
}
