import * as Assert from '../Assert/Assert.js'

export const getDownloadUrl = (repository, version, appImageName) => {
  Assert.string(version)
  return `https://github.com/${repository}/releases/download/v${version}/${appImageName}-v${version}.AppImage`
}
