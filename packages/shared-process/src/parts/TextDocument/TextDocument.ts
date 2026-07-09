import * as JoinLines from '../JoinLines/JoinLines.ts'

export const state: any = {
  textDocuments: Object.create(null),
  /** @type{any[]} */
  listeners: [],
}

// const toOffsetBasedEdit = (textDocument, documentEdit) => {
//   let offset = 0
//   let rowIndex = 0
//   while (rowIndex++ < documentEdit.rowIndex) {
//     offset += textDocument.lines[rowIndex].length
//   }
//   offset += documentEdit.columnIndex
//   return {
//     offset,
//     inserted: documentEdit.inserted,
//     deleted: documentEdit.deleted,
//   }
// }

export const applyEdit = (socket: any, textDocument: any, documentEdits: any): any => {
  // TODO avoid extra object allocation and anonymous function
  // const offsetBasedEdits = documentEdits.map((e) =>
  //   toOffsetBasedEdit(textDocument, e)
  // )
  for (const listener of state.listeners) {
    listener(textDocument, documentEdits)
  }
}

export const getText = (textDocument: any): any => {
  return JoinLines.joinLines(textDocument.lines)
}

export const onChange = (listener: any): any => {
  state.listeners.push(listener)
}
