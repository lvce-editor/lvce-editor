import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getTerminalSpawnOptions = () => {
  return SharedProcess.invoke('GetTerminalSpawnOptions.getTerminalSpawnOptions')
}
