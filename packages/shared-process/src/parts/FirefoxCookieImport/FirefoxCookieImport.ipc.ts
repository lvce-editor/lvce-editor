import * as FirefoxCookieImport from './FirefoxCookieImport.ts'

export const name = 'FirefoxCookieImport'

export const Commands = {
  getInfo: FirefoxCookieImport.getInfo,
  importCookies: FirefoxCookieImport.importCookies,
}
