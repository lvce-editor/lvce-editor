import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { ow } from './_shared.js'

// TODO when using textDocument.create sync with renderer worker only if necessary
// e.g. when is virtual file system -> need to get from renderer worker
// else just create it

export const state = {
  /** @type{any[]} */
  onDidCreateTextDocument: [],
  /** @type{any[]} */
  onDidChangeTextDocumentListeners: [],
  /** @type{any[]} */
  onDidSaveTextDocumentListeners: [],
  textDocuments: Object.create(null),
}

export const onDidChangeTextDocument = (listener) => {
  ow(listener, ow.function)
  state.onDidChangeTextDocumentListeners.push(listener)
  // SharedProcess.send({
  //   jsonrpc: '2.0',
  //   method: 'onChangeDocumentListener',
  //   params: [],
  // })
}

export const onDidSaveTextDocument = (listener) => {
  ow(listener, ow.function)
  state.onDidSaveTextDocumentListeners.push(listener)
}

// const applyEdits = (state, edits) => {
//   console.assert(state !== undefined)
//   console.assert(Array.isArray(edits))
//   for (const edit of edits) {
//     switch (edit.type) {
//       case /* singleLineEdit */ 1:
//         state.lines[edit.rowIndex] =
//           state.lines[edit.rowIndex].slice(0, edit.columnIndex - edit.deleted) +
//           edit.inserted +
//           state.lines[edit.rowIndex].slice(edit.columnIndex)
//         break
//       case /* splice */ 2:
//         state.lines.splice(edit.rowIndex, edit.count, ...edit.newLines)
//         break
//       default:
//         console.warn('unknown edit', edit)
//         break
//     }
//     // const rowIndex = lineAt(edit.offset)
//     // if (edit.text.includes('\n')) {
//     //   // TODO splice lines
//     // }
//     // state.lines[rowIndex]
//   }

//   // for (const listener of state.listeners) {
//   //   listener(state, edits)
//   // }
//   // TODO
// }

const getOffset = (textDocument, position) => {
  let offset = 0
  let rowIndex = 0
  while (rowIndex++ < position.rowIndex) {
    offset += textDocument.lines[rowIndex].length
  }
  offset += position.columnIndex
  return offset
}

const toOffsetBasedEdit = (textDocument, documentEdit) => {
  switch (documentEdit.type) {
    case /* singleLineEdit */ 1: {
      const offset = getOffset(textDocument, documentEdit)
      return {
        offset,
        inserted: documentEdit.inserted,
        deleted: documentEdit.deleted,
        // type: /* singleLineEdit */ 1
      }
    }
    case /* splice */ 2:
      const offset = getOffset(textDocument, {
        rowIndex: documentEdit.rowIndex,
        columnIndex: textDocument.lines[documentEdit.rowIndex - 1].length,
      })
      const inserted = '\n' + documentEdit.newLines.join('\n')
      return {
        offset,
        inserted,
        deleted: 0 /* TODO */,
      }
  }
}

// TODO incremental edits, don't send full text
export const applyEdit = (id, text, edits) => {
  const textDocument = get(id)
  textDocument.lines = text.split('\n')
  const offsetBasedEdits = edits.map((edit) =>
    toOffsetBasedEdit(textDocument, edit)
  )
  for (const listener of state.onDidChangeTextDocumentListeners) {
    // TODO avoid extra object allocation
    listener(textDocument, offsetBasedEdits)
  }
}

// TODO data oriented vs object oriented
// data -> simpler, exposes internals, sometimes weird/long (vscode.TextDocument.getText(textDocument))
// object oriented -> hides internals, banana problem (textDocument.getText())

// TODO send to shared process, which sends it to renderer worker
// renderer worker sends back the edit
export const applyEdit2 = (textDocument, edit) => {
  ow(
    textDocument,
    ow.object.exactShape({
      id: ow.number.greaterThanOrEqual(0),
      getText: ow.function,
    })
  )
  ow(
    edit,
    ow.object.exactShape({
      offset: ow.number.greaterThanOrEqual(0),
      inserted: ow.string,
      deleted: ow.number.greaterThanOrEqual(0),
    })
  )

  let rowIndex = 0
  let offset = 0
  const lines = textDocument.getText().split('\n')
  while (offset < edit.offset) {
    offset += lines[rowIndex++].length + 1
  }
  rowIndex--
  offset -= lines[rowIndex].length + 1
  const edit2 = {
    rowIndex,
    inserted: edit.inserted,
    deleted: edit.deleted,
    columnIndex: edit.offset - offset + edit.deleted,
    type: 1,
  }

  // // TODO should be invoke and return boolean whether edit was applied or not
  SharedProcess.send({
    event: 'TextDocument.applyEdit',
    args: [/* id */ textDocument.id, /* edits */ edit2],
  })
}

export const create = (textDocumentId, languageId, content) => {
  const textDocument = {
    languageId,
    lines: content.split('\n'),
  }
  state.textDocuments[textDocumentId] = textDocument
}

const createTextDocument = (uri, languageId, text) => {
  ow(uri, ow.string)
  ow(languageId, ow.string)
  ow(text, ow.string)
  const lines = text.split('\n')
  return {
    /** @internal */
    lines,
    uri,
    languageId,
    getText() {
      return lines.join('\n')
    },
  }
}

export const sync = (documentId, text) => {
  const textDocument = get(documentId)
  textDocument.lines = text.split('\n')
}

export const syncInitial = (uri, documentId, languageId, text) => {
  const textDocument = createTextDocument(uri, languageId, text)
  state.textDocuments[documentId] = textDocument
}

export const get = (textDocumentId) => {
  const textDocument = state.textDocuments[textDocumentId]
  ow(textDocument, ow.object)
  return textDocument
}
