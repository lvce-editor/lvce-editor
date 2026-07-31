import * as MainProcess from '../MainProcess/MainProcess.ts'

export const getInfo = (): any => {
  return MainProcess.invoke('FirefoxCookieImport.getInfo')
}

export const importCookies = (): any => {
  return MainProcess.invoke('FirefoxCookieImport.importCookies')
}
