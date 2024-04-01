import * as IsFirefox from '../IsFirefox/IsFirefox.ts'

export const isFileSystemAccessNotSupportedOnFireFoxError = (error) => {
  return error instanceof TypeError && error.message === 'item.getAsFileSystemHandle is not a function' && IsFirefox.isFirefox
}
