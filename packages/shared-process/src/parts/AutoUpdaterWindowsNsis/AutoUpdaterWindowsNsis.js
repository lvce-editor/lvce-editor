import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.js'
import * as Download from '../Download/Download.js'
import * as GetWindowsNsisDownloadUrl from '../GetWindowsNsisDownloadUrl/GetWindowsNsisDownloadUrl.js'
import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'
import * as Logger from '../Logger/Logger.js'

const getOutfilePath = (version) => {
  Assert.string(version)
  const outFile = join(tmpdir(), `nsis-update-${version}`)
  return outFile
}

export const downloadUpdate = async (version) => {
  try {
    Assert.string(version)
    const repository = Platform.getRepository()
    const setupName = Platform.getSetupName()
    const fileName = `${setupName}-v${version}.exe`
    const downLoadUrl = GetWindowsNsisDownloadUrl.getDownloadUrl(repository, version, fileName)
    const outFile = getOutfilePath(version)
    Logger.info(`[shared-process] downloading nsis update: ${downLoadUrl} -> ${outFile}`)
    await Download.download(downLoadUrl, outFile)
    Logger.info(`[shared-process] downloaded nsis update: ${outFile}`)
    return outFile
  } catch (error) {
    throw new VError(error, `Failed to download new version ${version}`)
  }
}

const getNsisUpdateArgs = () => {
  const args = []
  args.push('--updated')
  args.push('/S')
  args.push('--force-run')
  return args
}

export const installAndRestart = async (downloadPath) => {
  try {
    Assert.string(downloadPath)
    throw new Error('not implemented')
  } catch (error) {
    throw new VError(error, `Failed to install nsis update`)
  }
}
