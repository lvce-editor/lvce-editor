import * as CookieImportProcessPath from '../CookieImportProcessPath/CookieImportProcessPath.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchCookieImportProcess = (): Promise<any> => {
  return LaunchProcess.launchProcess({
    defaultPath: CookieImportProcessPath.cookieImportProcessPath,
    isElectron: IsElectron.isElectron,
    name: 'Cookie Import Process',
    settingName: 'develop.cookieImportProcessPath',
    targetRpcId: undefined,
  })
}
