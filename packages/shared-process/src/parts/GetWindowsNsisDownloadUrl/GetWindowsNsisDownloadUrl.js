import * as Assert from '../Assert/Assert.js'

export const getDownloadUrl = (repository, version, fileName) => {
  Assert.string(repository)
  Assert.string(version)
  Assert.string(fileName)
  return `https://github.com/${repository}/releases/download/v${version}/${fileName}`
}
