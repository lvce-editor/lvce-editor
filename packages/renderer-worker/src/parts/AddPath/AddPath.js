import * as Assert from '../Assert/Assert.ts'

export const addPath = (paths, path) => {
  Assert.array(paths)
  Assert.string(path)
  const index = paths.indexOf(path)
  if (index === -1) {
    return [path, ...paths]
  }
  return [path, ...paths.slice(0, index), ...paths.slice(index + 1)]
}
