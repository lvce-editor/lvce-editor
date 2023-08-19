import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const exit = () => {
  return SharedProcess.invoke('Exit.exit')
}
