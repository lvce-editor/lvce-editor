import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const crash = () => {
  return SharedProcess.invoke('ProcessCrash.crash')
}

export const crashAsync = () => {
  return SharedProcess.invoke('ProcessCrash.crashAsync')
}
