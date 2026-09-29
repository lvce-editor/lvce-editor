import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const rebuildNodePty = (): any => {
  return NetworkProcess.invoke('RebuildNodePty.rebuildNodePty')
}
