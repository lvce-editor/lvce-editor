import * as Path from '../Path/Path.ts'

export const getNativeDependencyCachePath = (root: string, hash: string): string => {
  return Path.join(root, '.n', hash)
}
