export const state = {
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

export const applyEdit = (socket, textDocument, documentEdits) => {
  // TODO avoid extra object allocation and anonymous function
  // const offsetBasedEdits = documentEdits.map((e) =>
  //   toOffsetBasedEdit(textDocument, e)
  // )
  for (const listener of state.listeners) {
    listener(textDocument, documentEdits)
  }
}

export const getText = (textDocument) => {
  return textDocument.lines.join('\n')
}

export const onChange = (listener) => {
  state.listeners.push(listener)
}
