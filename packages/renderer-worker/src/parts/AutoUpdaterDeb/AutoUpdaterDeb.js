// TODO remove this code when auto update through apt is supported

import * as Assert from '../Assert/Assert.js'
import * as Download from '../Download/Download.js'
import * as Exec from '../Exec/Exec.js'
import * as GetDebArch from '../GetDebArch/GetDebArch.js'
import * as GetDebDownloadUrl from '../GetDebDownloadUrl/GetDebDownloadUrl.js'
import * as Os from '../Os/Os.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'
import { VError } from '../VError/VError.js'

const pathSeparator = '/'

const getOutFilePath = (tmpDir, applicationName, debArch, version) => {
  return `${tmpDir}${pathSeparator}${applicationName}-${version}_${debArch}.deb`
}

export const downloadUpdate = async (version) => {
  Assert.string(version)
  const repository = await Platform.getRepository()
  const applicationName = await Platform.getRepository()
  const arch = await Process.getArch()
  const debArch = GetDebArch.getDebArch(arch)
  const downloadUrl = GetDebDownloadUrl.getDebDownloadUrl(repository, version, applicationName, debArch)
  const tmpDir = await Os.getTmpDir()
  const outFilePath = getOutFilePath(tmpDir, applicationName, debArch, version)
  await Download.downloadUrl(downloadUrl, outFilePath)
  return outFilePath
}

export const installAndRestart = async (downloadPath) => {
  try {
    Assert.string(downloadPath)
    await Exec.exec(`sudo`, ['dpkg', '-i', downloadPath])
  } catch (error) {
    throw new VError(error, `Failed to install deb update`)
  }
}
