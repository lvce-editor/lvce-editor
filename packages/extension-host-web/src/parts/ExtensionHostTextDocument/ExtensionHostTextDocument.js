import * as Assert from '../Assert/Assert.js'

// TODO when using textDocument.create sync with renderer worker only if necessary
// e.g. when is virtual file system -> need to get from renderer worker
// else just create it

export const state = {
  /** @type{any[]} */
  onDidOpenEditorListeners: [],
  /** @type{any[]} */
  onWillChangeEditorListeners: [],
  /** @type{any[]} */
  onDidChangeTextDocumentListeners: [],
  /** @type{any[]} */
  onDidSaveTextDocumentListeners: [],
  textDocuments: Object.create(null),
}

export const onWillChangeTextDocument = (listener) => {
  state.onWillChangeEditorListeners.push(listener)
}

export const onDidChangeTextDocument = (listener) => {
  state.onDidChangeTextDocumentListeners.push(listener)
  // SharedProcess.send({
  //   jsonrpc: '2.0',
  //   method: 'onChangeDocumentListener',
  //   params: [],
  // })
}

export const onDidSaveTextDocument = (listener) => {
  state.onDidSaveTextDocumentListeners.push(listener)
}

const applyEdits = (state, edits) => {
  console.assert(state !== undefined)
  console.assert(Array.isArray(edits))
  for (const edit of edits) {
    switch (edit.type) {
      case /* singleLineEdit */ 1:
        state.lines[edit.rowIndex] =
          state.lines[edit.rowIndex].slice(0, edit.columnIndex - edit.deleted) +
          edit.inserted +
          state.lines[edit.rowIndex].slice(edit.columnIndex)
        break
      case /* splice */ 2:
        state.lines.splice(edit.rowIndex, edit.count, ...edit.newLines)
        break
      default:
        console.warn('unknown edit', edit)
        break
    }
    // const rowIndex = lineAt(edit.offset)
    // if (edit.text.includes('\n')) {
    //   // TODO splice lines
    // }
    // state.lines[rowIndex]
  }

  // for (const listener of state.listeners) {
  //   listener(state, edits)
  // }
  // TODO
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
    if (error && error.message) {
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
  state.textDocuments[textDocumentId] = textDocument
  runListenersSafe(state.onDidOpenEditorListeners, textDocument)
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
  const textDocument = state.textDocuments[textDocumentId]
  if (!textDocument) {
    console.warn(
      `sync not possible, no matching textDocument with id ${textDocumentId}`
    )
    return
  }
  const syntheticChanges = getSyntheticChanges(textDocument, changes)
  runListenersSafe(
    state.onWillChangeEditorListeners,
    textDocument,
    syntheticChanges
  )
  const syntheticChange = syntheticChanges[0]
  const oldText = textDocument.text
  const before = oldText.slice(0, syntheticChange.startOffset)
  const after = oldText.slice(syntheticChange.endOffset)
  textDocument.text = before + syntheticChange.inserted + after
  runListenersSafe(
    state.onDidChangeTextDocumentListeners,
    textDocument,
    syntheticChanges
  )
}

export const get = (textDocumentId) => {
  const textDocument = state.textDocuments[textDocumentId]
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

const getSyntheticChange = (textDocument, edit) => {
  const start = getPosition(textDocument, edit.offset - edit.deleted)
  const end = getPosition(textDocument, edit.offset)
  return {
    start,
    end,
    inserted: edit.inserted.split('\n'),
    deleted: [],
  }
}

export const applyEdit = async (textDocument, edit) => {
  const syntheticChange = getSyntheticChange(textDocument, edit)
  // TODO send synthetic change to shared process to renderer-worker
  // await SharedProcess.invoke({
  //   jsonrpc: '2.0',
  //   method: 'TextDocument.applyEdit',
  //   params: [
  //     /* textDocumentId */ textDocument.documentId,
  //     /* change */ syntheticChange,
  //   ],
  // })
  console.log({ syntheticChange })
  // await SharedProcess.invoke(991, [syntheticChange])
}

export const onDidOpenTextDocument = (listener) => {
  state.onDidOpenEditorListeners.push(listener)
  for (const textDocument of Object.values(state.textDocuments)) {
    runListenerSafe(listener, textDocument)
  }
}

export const onWillChangeEditor = (listener) => {
  state.onWillChangeEditorListeners.push(listener)
}

export const setLanguageId = (textDocumentId, languageId) => {
  const newTextDocument = {
    ...state.textDocuments[textDocumentId],
    languageId,
  }
  state.textDocuments[textDocumentId] = newTextDocument
  runListenersSafe(state.onDidOpenEditorListeners, newTextDocument)
}

export const getTextDocuments = () => {
  return Object.values(state.textDocuments)
}
