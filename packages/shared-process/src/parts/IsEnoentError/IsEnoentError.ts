import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as IsEnoentErrorWindows from '../IsEnoentErrorWindows/IsEnoentErrorWindows.ts'

const isEnoentErrorLinux = (error: any): any => {
  return error.code === ErrorCodes.ENOENT
}

export const isEnoentError = (error: any): any => {
  if (!error) {
    return false
  }
  return isEnoentErrorLinux(error) || IsEnoentErrorWindows.isEnoentErrorWindows(error)
}
