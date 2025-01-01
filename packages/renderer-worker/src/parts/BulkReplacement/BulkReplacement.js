import * as LegacyBulkReplacement from '../LegacyBulkReplacement/LegacyBulkReplacement.js'

export const applyBulkReplacement = async (files, ranges, replacement) => {
  if (files && ranges && replacement) {
    return LegacyBulkReplacement.applyLegacyBulkReplacement(files, ranges, replacement)
  }
  // new api
  const edits = files
  console.log({ edits })
}
