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

export const addWillChangeListener = (listener) => {
  // @ts-ignore
  state.onWillChangeEditorListeners.push(listener)
}

export const addDidChangeListener = (listener) => {
  // @ts-ignore
  state.onDidChangeTextDocumentListeners.push(listener)
}
export const addDidOpenListener = (listener) => {
  // @ts-ignore
  state.onDidOpenEditorListeners.push(listener)
}

export const addDidSaveListener = (listener) => {
  // @ts-ignore
  state.onDidSaveTextDocumentListeners.push(listener)
}

export const setDocument = (textDocumentId, textDocument) => {
  state.textDocuments[textDocumentId] = textDocument
}

export const getDidOpenListeners = () => {
  return state.onDidSaveTextDocumentListeners
}

export const getWillChangeListeners = () => {
  return state.onWillChangeEditorListeners
}
export const getDidChangeListeners = () => {
  return state.onDidChangeTextDocumentListeners
}

export const getDocument = (textDocumentId) => {
  return state.textDocuments[textDocumentId]
}

export const getDocuments = () => {
  return Object.values(state.textDocuments)
}
