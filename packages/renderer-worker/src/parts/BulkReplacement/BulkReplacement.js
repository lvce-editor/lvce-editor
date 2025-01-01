import * as BulkReplacementContent from '../BulkReplacementContent/BulkReplacementContent.ts'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as LegacyBulkReplacement from '../LegacyBulkReplacement/LegacyBulkReplacement.js'

const applyFileReplacement = async (edit) => {
  console.log({ edit })
  const { uri, changes } = edit
  const oldContent = await FileSystem.readFile(uri)
  const newContent = BulkReplacementContent.getNewContent(oldContent, changes)
  await FileSystem.writeFile(uri, newContent)
}

export const applyBulkReplacement = async (files, ranges, replacement) => {
  if (files && ranges && replacement) {
    return LegacyBulkReplacement.applyLegacyBulkReplacement(files, ranges, replacement)
  }
  // new api
  const edits = files
  await Promise.all(edits.map(applyFileReplacement))
}
