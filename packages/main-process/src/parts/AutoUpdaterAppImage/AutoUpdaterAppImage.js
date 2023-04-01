const { join } = require('node:path')
const { rename } = require('node:fs/promises')
const { spawn } = require('node:child_process')
const { tmpdir } = require('node:os')
const Assert = require('../Assert/Assert.js')
const CompareVersion = require('../CompareVersion/CompareVersion.js')
const Download = require('../Download/Download.js')
const GetLatestReleaseVersion = require('../GetLatestReleaseVersion/GetLatestReleaseVersion.js')
const Platform = require('../Platform/Platform.js')
const VError = require('verror')

const getDownloadUrl = (repository, version, appImageName) => {
  Assert.string(version)
  return `https://github.com/${repository}/releases/download/v${version}/${appImageName}-v${version}.AppImage`
}

const getOutfilePath = (version) => {
  Assert.string(version)
  const outFile = join(tmpdir(), `appimage-${version}`)
  return outFile
}

exports.downloadUpdate = async (version) => {
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

exports.checkForUpdatesAndNotify = async () => {
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

exports.installAndRestart = async (downloadPath) => {
  try {
    const appImageFile = getAppImagePath()
    if (!appImageFile) {
      throw new Error(`App image path not found`)
    }
    await installNewAppImage(appImageFile, downloadPath)
    await restart(downloadPath)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to install app image update`)
  }
}
