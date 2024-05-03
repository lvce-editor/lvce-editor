import * as NetworkProcess from '../NetworkProcess/NetworkProcess.js'

export const rebuildNodePty = () => {
  return NetworkProcess.invoke('RebuildNodePty.rebuildNodePty')
}
