import * as Assert from '../Assert/Assert.ts'

export const getDownloadUrl = (repository, version, applicationName, debArch) => {
  Assert.string(repository)
  Assert.string(version)
  Assert.string(applicationName)
  Assert.string(debArch)
  return `https://github.com/${repository}/releases/download/v${version}/${applicationName}-v${version}_${debArch}.deb`
}
