import * as Assert from '../Assert/Assert.js'
import * as TextDocumentState from '../TextDocumentState/TextDocumentState.js'

export const onWillChangeTextDocument = (listener) => {
  TextDocumentState.addWillChangeListener(listener)
}

export const onDidChangeTextDocument = (listener) => {
  TextDocumentState.addDidChangeListener(listener)
}

export const onDidSaveTextDocument = (listener) => {
  TextDocumentState.addDidSaveListener(listener)
}

export const getOffset = (textDocument, position) => {
  let offset = 0
  let rowIndex = 0
  while (rowIndex++ < position.rowIndex) {
    const newLineIndex = textDocument.text.indexOf('\n', offset)
    offset = newLineIndex + 1
  }
  offset += position.columnIndex
  return offset
}

// const toOffsetBasedEdit = (textDocument, documentEdit) => {
//   switch (documentEdit.type) {
//     case /* singleLineEdit */ 1: {
//       const offset = getOffset(textDocument, documentEdit)
//       return {
//         offset,
//         inserted: documentEdit.inserted,
//         deleted: documentEdit.deleted,
//         // type: /* singleLineEdit */ 1
//       }
//     }
//     case /* splice */ 2:
//       const offset = getOffset(textDocument, {
//         rowIndex: documentEdit.rowIndex,
//         columnIndex: textDocument.lines[documentEdit.rowIndex - 1].length,
//       })
//       const inserted = '\n' + documentEdit.newLines.join('\n')
//       return {
//         offset,
//         inserted,
//         deleted: 0 /* TODO */,
//       }
//   }
// }

// TODO incremental edits, don't send full text
// export const applyEdit = (id, text, edits) => {
//   const textDocument = get(id)
//   textDocument.lines = text.split('\n')
//   const offsetBasedEdits = edits.map((edit) =>
//     toOffsetBasedEdit(textDocument, edit)
//   )
//   for (const listener of state.onDidChangeTextDocumentListeners) {
//     // TODO avoid extra object allocation
//     listener(textDocument, offsetBasedEdits)
//   }
// }

// TODO data oriented vs object oriented
// data -> simpler, exposes internals, sometimes weird/long (vscode.TextDocument.getText(textDocument))
// object oriented -> hides internals, banana problem (textDocument.getText())

// TODO send to shared process, which sends it to renderer worker
// renderer worker sends back the edit
// export const applyEdit2 = (textDocument, edit) => {
//   if (VALIDATION_ENABLED) {
//     assert(typeof textDocument === 'object')
//     assert(textDocument !== null)
//     assert(typeof textDocument.id === 'number')
//     assert(textDocument.id > 0)
//     assert(typeof textDocument.getText === 'function')
//     assert(typeof edit === 'object')
//     assert(typeof edit.offset === 'number')
//     assert(typeof edit.inserted === 'string')
//     assert(typeof edit.deleted === 'number')
//   }

//   let rowIndex = 0
//   let offset = 0
//   const lines = textDocument.getText().split('\n')
//   while (offset < edit.offset) {
//     offset += lines[rowIndex++].length + 1
//   }
//   rowIndex--
//   offset -= lines[rowIndex].length + 1
//   const edit2 = {
//     rowIndex,
//     inserted: edit.inserted,
//     deleted: edit.deleted,
//     columnIndex: edit.offset - offset + edit.deleted,
//     type: 1,
//   }

//   // // TODO should be invoke and return boolean whether edit was applied or not
//   SharedProcess.send({
//     event: 'TextDocument.applyEdit',
//     args: [/* id */ textDocument.id, /* edits */ edit2],
//   })
// }

// export const create = (textDocumentId, languageId, content) => {
//   const textDocument = {
//     languageId,
//     lines: content.split('\n'),
//   }
//   state.textDocuments[textDocumentId] = textDocument
// }

// const createTextDocument = (uri, languageId, text) => {
//   if (VALIDATION_ENABLED) {
//     assert(typeof uri === 'string')
//     assert(typeof languageId === 'string')
//     assert(typeof text === 'string')
//   }
//   const state = {
//     /** @internal */
//     lines: text.split('\n'),
//     uri,
//     languageId,
//     getText() {
//       return state.lines.join('\n')
//     },
//   }
//   return state
// }

// export const sync = (documentId, languageId, text) => {
//   const textDocument = get(documentId)
//   if (!textDocument) {
//     console.warn(`textDocument is undefined ${languageId}`)
//     return
//   }
//   textDocument.languageId = languageId
//   textDocument.lines = text.split('\n')
//   // console.log('sync', JSON.stringify(text))
// }

const runListenerSafe = async (listener, ...args) => {
  try {
    await listener(...args)
  } catch (error) {
    // @ts-ignore
    if (error && error.message) {
      // @ts-ignore
      error.message = 'Failed to run open listener: ' + error.message
    }
    console.error(error)
  }
}

const runListenersSafe = (listeners, ...args) => {
  for (const listener of listeners) {
    runListenerSafe(listener, ...args)
  }
}

export const syncFull = (uri, textDocumentId, languageId, text) => {
  const textDocument = {
    uri,
    documentId: textDocumentId,
    languageId,
    text,
  }
  TextDocumentState.setDocument(textDocumentId, textDocument)
  runListenersSafe(TextDocumentState.getDidOpenListeners(), textDocument)
}

const getSyntheticChanges = (textDocument, changes) => {
  // console.log({ textDocument, changes })
  Assert.object(textDocument)
  Assert.array(changes)
  const change = changes[0]
  const startOffset = getOffset(textDocument, change.start)
  const endOffset = getOffset(textDocument, change.end)
  const inserted = change.inserted.join('\n')
  const syntheticChanges = [
    {
      startOffset,
      endOffset,
      inserted,
    },
  ]
  return syntheticChanges
}

export const syncIncremental = (textDocumentId, changes) => {
  Assert.number(textDocumentId)
  Assert.array(changes)
  const textDocument = TextDocumentState.getDocument(textDocumentId)
  if (!textDocument) {
    console.warn(`sync not possible, no matching textDocument with id ${textDocumentId}`)
    return
  }
  const syntheticChanges = getSyntheticChanges(textDocument, changes)
  runListenersSafe(TextDocumentState.getWillChangeListeners(), textDocument, syntheticChanges)
  const syntheticChange = syntheticChanges[0]
  const oldText = textDocument.text
  const before = oldText.slice(0, syntheticChange.startOffset)
  const after = oldText.slice(syntheticChange.endOffset)
  textDocument.text = before + syntheticChange.inserted + after
  runListenersSafe(TextDocumentState.getDidChangeListeners(), textDocument, syntheticChanges)
}

export const get = (textDocumentId) => {
  const textDocument = TextDocumentState.getDocument(textDocumentId)
  return textDocument
}

export const getText = (textDocument) => {
  return textDocument.text
}

export const getPosition = (textDocument, offset) => {
  let index = 0
  let rowIndex = 0
  let newLineIndex = 0
  const text = textDocument.text
  while (index < offset) {
    newLineIndex = text.indexOf('\n', index)
    if (newLineIndex === -1) {
      break
    }
    const newIndex = newLineIndex + 1
    if (newIndex > offset) {
      break
    }
    index = newIndex
    rowIndex++
  }
  const columnIndex = offset - index
  return {
    rowIndex,
    columnIndex,
  }
}

export const applyEdit = async (textDocument, edit) => {
  throw new Error('not implemented')
}

export const onDidOpenTextDocument = (listener) => {
  TextDocumentState.addDidOpenListener(listener)
  for (const textDocument of TextDocumentState.getDocuments()) {
    runListenerSafe(listener, textDocument)
  }
}

export const onWillChangeEditor = (listener) => {
  TextDocumentState.addWillChangeListener(listener)
}

export const setLanguageId = (textDocumentId, languageId) => {
  const newTextDocument = {
    ...TextDocumentState.getDocument(textDocumentId),
    languageId,
  }
  TextDocumentState.setDocument(textDocumentId, newTextDocument)
  runListenersSafe(TextDocumentState.getDidOpenListeners(), newTextDocument)
}

export const getTextDocuments = () => {
  return TextDocumentState.getDocuments()
}

export const setFiles = (files) => {
  for (const file of files) {
    TextDocumentState.setDocument(file.id, file)
  }
}

export const getAll = () => {
  return TextDocumentState.getDocuments()
}
