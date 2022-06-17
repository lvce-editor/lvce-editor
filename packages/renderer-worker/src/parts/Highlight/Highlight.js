// import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.js'
import * as Languages from '../Languages/Languages.js'

export const state = {
  sentLanguages: new Set(),
}

// TODO
export const updateIncremental = (textDocumentId, edits) => {
  // SyntaxHighlightingWorker.send([
  //   /* highlightUpdateIncremental */ 1,
  //   /* textDocumentId */ textDocumentId,
  //   /* edits */ edits,
  // ])
}

export const updateFull = (textDocumentId, text) => {
  // SyntaxHighlightingWorker.send([
  //   /* highlightUpdateFull */ 6,
  //   /* textDocumentId */ textDocumentId,
  //   /* text */ text,
  // ])
}

export const create = (languageId, textDocumentId, text) => {
  if (!state.sentLanguages.has(languageId)) {
    state.sentLanguages.add(languageId)
    const tokenizeFunctionPath = Languages.getTokenizeFunctionPath(languageId)
    if (tokenizeFunctionPath) {
      // SyntaxHighlightingWorker.send([
      //   /* setTokenizeFunctionPath */ 7,
      //   /* languageId */ languageId,
      //   /* tokenizeFunctionPath */ tokenizeFunctionPath,
      // ])
    }
  }
  // SyntaxHighlightingWorker.send([
  //   /* highlightCreate */ 2,
  //   /* textDocumentId */ textDocumentId,
  //   /* languageId */ languageId,
  //   /* text */ text,
  // ])
}

// TODO probably not necessary -> just use create
export const setLanguageId = (textDocumentId, languageId) => {
  // SyntaxHighlightingWorker.send([
  //   /* highlightSetLanguageId */ 4,
  //   /* textDocumentId */ textDocumentId,
  //   /* languageId */ languageId,
  // ])
}
