import * as Assert from '../Assert/Assert.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const specialSchemes = ['memfs://', 'html://', 'fetch://']

const isSpecialScheme = (files) => {
  for (const file of files) {
    for (const scheme of specialSchemes) {
      if (file && typeof file === 'string' && file.startsWith(scheme)) {
        return true
      }
    }
  }
  return false
}

export const applyLegacyBulkReplacement = async (files, ranges, replacement) => {
  Assert.array(files)
  Assert.array(ranges)
  Assert.string(replacement)
  if (isSpecialScheme(files)) {
    throw new Error('Legacy bulk replacement is not supported for in-memory workspaces')
  }
  await SharedProcess.invoke('BulkReplacement.applyBulkReplacement', files, ranges, replacement)
}
