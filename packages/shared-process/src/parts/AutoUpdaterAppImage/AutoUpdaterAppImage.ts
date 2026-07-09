import { rename } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.ts'
import * as Download from '../Download/Download.ts'
import * as GetAppImageDownloadUrl from '../GetAppImageDownloadUrl/GetAppImageDownloadUrl.ts'
import * as GetAppImagePath from '../GetAppImagePath/GetAppImagePath.ts'
import * as MakeExecutable from '../MakeExecutable/MakeExecutable.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Restart from '../Restart/Restart.ts'
import { VError } from '../VError/VError.ts'

const getOutfilePath = (version: any): any => {
  Assert.string(version)
  const outFile = join(tmpdir(), `appimage-${version}`)
  return outFile
}

export const downloadUpdate = async (version: any): Promise<any> => {
  try {
    Assert.string(version)
    const repository = Platform.getRepository()
    const appImageName = Platform.getAppImageName()
    const downLoadUrl = GetAppImageDownloadUrl.getDownloadUrl(repository, version, appImageName)
    const outFile = getOutfilePath(version)
    await Download.download(downLoadUrl, outFile)
    return outFile
  } catch (error) {
    throw new VError(error, `Failed to download new version ${version}`)
  }
}

const installNewAppImage = async (currentAppImageFile: any, downloadPath: any): Promise<any> => {
  try {
    await rename(downloadPath, currentAppImageFile)
    return currentAppImageFile
  } catch (error) {
    throw new VError(error, `Failed to rename AppImage file`)
  }
}

export const installAndRestart = async (downloadPath: any): Promise<any> => {
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
    throw new VError(error, `Failed to install AppImage update`)
  }
}
