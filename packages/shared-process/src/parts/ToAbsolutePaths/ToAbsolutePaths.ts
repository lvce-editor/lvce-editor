import * as Path from '../Path/Path.ts'

export const toAbsolutePaths = (path: any, dirents: any): any => {
  const absolutePaths: any[] = []
  for (const dirent of dirents) {
    absolutePaths.push(Path.join(path, dirent))
  }
  return absolutePaths
}
