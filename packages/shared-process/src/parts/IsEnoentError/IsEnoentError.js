import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as IsEnoentErrorWindows from '../IsEnoentErrorWindows/IsEnoentErrorWindows.js'

const isEnoentErrorLinux = (error) => {
  return error.code === ErrorCodes.ENOENT
}

export const isEnoentError = (error) => {
  if (!error) {
    return false
  }
  return isEnoentErrorLinux(error) || IsEnoentErrorWindows.isEnoentErrorWindows(error)
}
