export const getEtag = (fileStat: any): any => {
  return `W/"${[fileStat.ino, fileStat.size, fileStat.mtime.getTime()].join('-')}"`
}
