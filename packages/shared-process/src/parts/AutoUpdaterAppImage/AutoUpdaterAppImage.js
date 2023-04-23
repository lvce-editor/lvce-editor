import { rename } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.js'
import * as Download from '../Download/Download.js'
import * as GetAppImageDownloadUrl from '../GetAppImageDownloadUrl/GetAppImageDownloadUrl.js'
import * as GetAppImagePath from '../GetAppImagePath/GetAppImagePath.js'
import * as MakeExecutable from '../MakeExecutable/MakeExecutable.js'
import * as Platform from '../Platform/Platform.js'
import * as Restart from '../Restart/Restart.js'
import { VError } from '../VError/VError.js'

const getOutfilePath = (version) => {
  Assert.string(version)
  const outFile = join(tmpdir(), `appimage-${version}`)
  return outFile
}

export const downloadUpdate = async (version) => {
  try {
    Assert.string(version)
    const repository = Platform.getRepository()
    const appImageName = Platform.getAppImageName()
    const downLoadUrl = GetAppImageDownloadUrl.getDownloadUrl(repository, version, appImageName)
    const outFile = getOutfilePath(version)
    await Download.download(downLoadUrl, outFile)
    return outFile
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download new version ${version}`)
  }
}

const installNewAppImage = async (currentAppImageFile, downloadPath) => {
  try {
    await rename(downloadPath, currentAppImageFile)
    return currentAppImageFile
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to rename AppImage file`)
  }
}

export const installAndRestart = async (downloadPath) => {
  try {
    Assert.string(downloadPath)
    const currentAppImageFile = GetAppImagePath.getAppImagePath()
    if (!currentAppImageFile) {
      throw new Error(`AppImage path not found`)
    }
    await MakeExecutable.makeExecutable(downloadPath)
    const installedPath = await installNewAppImage(currentAppImageFile, downloadPath)
    await Restart.restart(installedPath)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to install AppImage update`)
  }
}
