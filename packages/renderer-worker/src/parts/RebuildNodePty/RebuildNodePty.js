import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const rebuildNodePty = async () => {
  await SharedProcess.invoke('RebuildNodePty.rebuildNodePty')
}
