import * as Assert from '../Assert/Assert.js'

export const getDownloadUrl = (repository, version, fileName) => {
  Assert.string(version)
  return `https://github.com/${repository}/releases/download/v${version}/${fileName}`
}
