import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Assert from '../Assert/Assert.js'

export const applyBulkReplacement = async (files, ranges, replacement) => {
  Assert.array(files)
  Assert.array(ranges)
  Assert.string(replacement)
  await SharedProcess.invoke('BulkReplacement.applyBulkReplacement', files, ranges, replacement)
}
