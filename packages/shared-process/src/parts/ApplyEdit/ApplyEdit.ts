import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as BulkReplacementContent from '../BulkReplacementContent/BulkReplacementContent.ts'

export const applyEdit = async (path, ranges, replacement) => {
  const content = await FileSystem.readFile(path)
  const newContent = BulkReplacementContent.getNewContent(content, ranges, replacement)
  await FileSystem.writeFile(path, newContent)
}
