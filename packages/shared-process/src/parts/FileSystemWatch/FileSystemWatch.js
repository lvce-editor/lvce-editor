import * as fs from 'node:fs/promises'

export const watchFile = (path) => {
  const watcher = fs.watch(path)
  return watcher
}
