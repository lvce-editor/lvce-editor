import { spawn } from 'node:child_process'
import { chmod, rename } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.js'
import * as CompareVersion from '../CompareVersion/CompareVersion.js'
import * as Download from '../Download/Download.js'
import * as GetLatestReleaseVersion from '../GetLatestReleaseVersion/GetLatestReleaseVersion.js'
import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'

const getDownloadUrl = (repository, version, appImageName) => {
  Assert.string(version)
  return `https://github.com/${repository}/releases/download/v${version}/${appImageName}-v${version}.AppImage`
}

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
    const downLoadUrl = getDownloadUrl(repository, version, appImageName)
    const outFile = getOutfilePath(version)
    await Download.download(downLoadUrl, outFile)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download new version ${version}`)
  }
}

export const checkForUpdatesAndNotify = async () => {
  const repository = Platform.getRepository()
  const version = await GetLatestReleaseVersion.getLatestReleaseVersion(repository)
  const currentVersion = Platform.version
  if (CompareVersion.isGreater(version, currentVersion)) {
    return {
      version,
    }
  } else {
    console.log('not update is available')
  }
}

const getAppImagePath = () => {
  return process.env.APPIMAGE
}

const installNewAppImage = async (appImageFile, downloadPath) => {
  try {
    await rename(downloadPath, appImageFile)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to rename AppImage file`)
  }
}

const restart = (downloadPath) => {
  // TODO handle errors
  spawn(downloadPath, { stdio: 'inherit' })
}

const makeExecutable = async (file) => {
  await chmod(file, 0o755)
}

export const installAndRestart = async (downloadPath) => {
  try {
    const appImageFile = getAppImagePath()
    if (!appImageFile) {
      throw new Error(`AppImage path not found`)
    }
    await makeExecutable(downloadPath)
    await installNewAppImage(appImageFile, downloadPath)
    await restart(downloadPath)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to install AppImage update`)
  }
}
