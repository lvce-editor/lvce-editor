import * as MainProcess from '../MainProcess/MainProcess.ts'

export const getInfo = (): any => {
  return MainProcess.invoke('ChromeCookieImport.getInfo')
}

export const importCookies = (): any => {
  return MainProcess.invoke('ChromeCookieImport.importCookies')
}
