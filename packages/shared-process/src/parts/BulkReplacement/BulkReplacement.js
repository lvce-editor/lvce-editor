import * as FileSystem from '../FileSystem/FileSystem.js'
import * as BulkReplacementContent from '../BulkReplacementContent/BulkReplacementContent.js'

const applyEdit = async (path, ranges, replacement) => {
  const content = await FileSystem.readFile(path)
  const newContent = BulkReplacementContent.getNewContent(content, ranges, replacement)
  await FileSystem.writeFile(path, newContent)
}

export const applyBulkReplacement = async (files, ranges, replacement) => {
  let rangeIndex = 0
  for (const file of files) {
    const rangeLength = ranges[rangeIndex]
    const rangeStartIndex = rangeIndex + 1
    const rangeEndIndex = rangeStartIndex + rangeLength
    const fileRanges = ranges.slice(rangeStartIndex, rangeEndIndex)
    await applyEdit(file, fileRanges, replacement)
    rangeIndex = rangeEndIndex
  }
}
