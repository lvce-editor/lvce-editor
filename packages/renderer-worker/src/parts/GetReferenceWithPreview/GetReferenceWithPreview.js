import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetLineText from '../GetLineText/GetLineText.js'

export const getReferenceWithPreview = async (reference) => {
  const content = await FileSystem.readFile(reference.uri)
  const lineText = GetLineText.getLineText(
    content,
    reference.startRowIndex,
    reference.startColumnIndex,
    reference.endRowIndex,
    reference.endColumnIndex,
  )
  return {
    ...reference,
    lineText,
  }
}
