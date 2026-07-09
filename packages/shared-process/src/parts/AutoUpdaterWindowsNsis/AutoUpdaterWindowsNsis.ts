import { spawn } from 'node:child_process'
import * as Assert from '../Assert/Assert.ts'
import * as Download from '../Download/Download.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as GetFirstSpawnedProcessEvent from '../GetFirstSpawnedProcessEvent/GetFirstSpawnedProcessEvent.ts'
import * as GetNsisUpdateArgs from '../GetNsisUpdateArgs/GetNsisUpdateArgs.ts'
import * as GetNsisDownloadPath from '../GetNsisUpdateDownloadPath/GetNsisUpdateDownloadPath.ts'
import * as GetWindowsNsisDownloadUrl from '../GetWindowsNsisDownloadUrl/GetWindowsNsisDownloadUrl.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Platform from '../Platform/Platform.ts'
import * as UpdateState from '../UpdateState/UpdateState.ts'
import * as UpdateStateType from '../UpdateStateType/UpdateStateType.ts'
import { VError } from '../VError/VError.ts'

const getArchPostFix = (arch: any): any => {
  switch (arch) {
    case 'arm':
    case 'arm64':
      return '-arm64'
    default:
      return '-x64'
  }
}

// TODO make it possible to cancel downloading updates
export const downloadUpdate = async (version: any): Promise<any> => {
  try {
    Assert.string(version)
    const repository = Platform.getRepository()
    const setupName = Platform.getSetupName()
    const archPostFix = getArchPostFix(process.arch)
    const fileName = `${setupName}-v${version}${archPostFix}.exe`
    const downLoadUrl = GetWindowsNsisDownloadUrl.getDownloadUrl(repository, version, fileName)
    const outFile = GetNsisDownloadPath.getNsisUpdateDownloadPath(version)
    Logger.info(`[shared-process] downloading nsis update: ${downLoadUrl} -> ${outFile}`)
    UpdateState.set(UpdateStateType.Downloading)
    await Download.download(downLoadUrl, outFile)
    UpdateState.set(UpdateStateType.Downloaded)
    Logger.info(`[shared-process] downloaded nsis update: ${outFile}`)
    return outFile
  } catch (error) {
    throw new VError(error, `Failed to download new version ${version}`)
  }
}

export const installAndRestart = async (downloadPath: any): Promise<any> => {
  try {
    Assert.string(downloadPath)
    const args = GetNsisUpdateArgs.getNsisUpdateArgs()
    Logger.info(`[shared-process] spawning nsis update: ${downloadPath}`)
    UpdateState.set(UpdateStateType.Updating)
    const child = spawn(downloadPath, args, {
      stdio: 'inherit',
      detached: true,
    })
    const { type, event } = await GetFirstSpawnedProcessEvent.getFirstSpawnedProcessEvent(child)
    if (type === FirstNodeWorkerEventType.Error) {
      throw new Error(`Child process error: ${event}`)
    }
    Logger.info(`[shared-process] finished nsis update`)
  } catch (error) {
    throw new VError(error, `Failed to install nsis update`)
  }
}
