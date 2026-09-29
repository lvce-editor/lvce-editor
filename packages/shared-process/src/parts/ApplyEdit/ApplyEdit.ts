import * as BulkReplacementContent from '../BulkReplacementContent/BulkReplacementContent.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const applyEdit = async (path: any, ranges: any, replacement: any): Promise<any> => {
  const content = await FileSystem.readFile(path)
  const newContent = BulkReplacementContent.getNewContent(content, ranges, replacement)
  await FileSystem.writeFile(path, newContent)
}
