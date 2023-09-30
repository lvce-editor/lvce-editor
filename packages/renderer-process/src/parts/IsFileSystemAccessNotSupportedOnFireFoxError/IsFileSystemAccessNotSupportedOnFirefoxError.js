import * as Platform from '../Platform/Platform.js'
import * as Browser from '../Browser/Browser.js'

export const isFileSystemAccessNotSupportedOnFireFoxError = (error) => {
  return error instanceof TypeError && error.message === 'item.getAsFileSystemHandle is not a function' && Browser.getBrowser() === 'firefox'
}
