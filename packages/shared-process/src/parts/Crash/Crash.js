import * as Timeout from '../Timeout/Timeout.js'

const handleTimeout = () => {
  throw new Error('oops')
}

export const crashSharedProcess = () => {
  Timeout.setTimeout(handleTimeout, 0)
}
