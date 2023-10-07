import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getTmpDir = () => {
  return SharedProcess.invoke('Os.getTmpDir')
}
