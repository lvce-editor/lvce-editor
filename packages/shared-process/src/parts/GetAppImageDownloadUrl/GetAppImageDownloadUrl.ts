import * as Assert from '../Assert/Assert.ts'

export const getDownloadUrl = (repository: any, version: any, appImageName: any): any => {
  Assert.string(version)
  return `https://github.com/${repository}/releases/download/v${version}/${appImageName}-v${version}.AppImage`
}
