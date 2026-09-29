import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const exit = (code) => {
  if (code === undefined) {
    return SharedProcess.invoke('Exit.exit')
  }
  return SharedProcess.invoke('Exit.exit', code)
}
