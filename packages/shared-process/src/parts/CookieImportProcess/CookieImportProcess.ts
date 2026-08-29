import * as LaunchCookieImportProcess from '../LaunchCookieImportProcess/LaunchCookieImportProcess.ts'

let ipcPromise: Promise<any> | undefined

export const getOrCreate = (): Promise<any> => {
  ipcPromise ||= LaunchCookieImportProcess.launchCookieImportProcess()
  return ipcPromise
}
