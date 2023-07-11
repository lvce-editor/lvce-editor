import * as fs from 'node:fs/promises'

export const readDir = (path) => {
  return fs.readdir(path)
}
