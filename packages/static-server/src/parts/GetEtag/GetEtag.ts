import type { Stats } from 'node:fs'

export const getEtag = (fileStat: Stats): string => {
  return `W/"${[fileStat.ino, fileStat.size, fileStat.mtime.getTime()].join('-')}"`
}
