import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const rebuildNodePty = () => {
  return NetworkProcess.invoke('RebuildNodePty.rebuildNodePty')
}
