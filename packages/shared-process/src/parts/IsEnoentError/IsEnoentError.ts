import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as IsEnoentErrorWindows from '../IsEnoentErrorWindows/IsEnoentErrorWindows.ts'

const isEnoentErrorLinux = (error) => {
  return error.code === ErrorCodes.ENOENT
}

export const isEnoentError = (error) => {
  if (!error) {
    return false
  }
  return isEnoentErrorLinux(error) || IsEnoentErrorWindows.isEnoentErrorWindows(error)
}
