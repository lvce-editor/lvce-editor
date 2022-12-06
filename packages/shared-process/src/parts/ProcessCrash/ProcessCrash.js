import * as Timeout from '../Timeout/Timeout.js'

const handleTimeout = () => {
  throw new Error('oops')
}

export const crash = () => {
  Timeout.setTimeout(handleTimeout, 0)
}

const handleTimeoutAsync = async () => {
  throw new Error('oops')
}

export const crashAsync = () => {
  Timeout.setTimeout(handleTimeoutAsync, 0)
}
