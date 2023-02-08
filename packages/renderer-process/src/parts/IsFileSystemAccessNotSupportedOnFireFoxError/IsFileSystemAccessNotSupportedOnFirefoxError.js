import * as Platform from '../Platform/Platform.js'

export const isFileSystemAccessNotSupportedOnFireFoxError = (error) => {
  return error instanceof TypeError && error.message === 'item.getAsFileSystemHandle is not a function' && Platform.getBrowser() === 'firefox'
}
