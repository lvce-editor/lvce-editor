import * as Assert from '../Assert/Assert.ts'

export const getDownloadUrl = (repository: any, version: any, fileName: any): any => {
  Assert.string(repository)
  Assert.string(version)
  Assert.string(fileName)
  return `https://github.com/${repository}/releases/download/v${version}/${fileName}`
}
