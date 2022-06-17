export const textDocumentSyncInitial = (
  extensionHost,
  uri,
  textDocumentId,
  languageId,
  text
) => {
  return extensionHost.invoke(
    'TextDocument.syncInitial',
    uri,
    textDocumentId,
    languageId,
    text
  )
}

export const textDocumentSyncIncremental = (
  extensionHost,
  textDocumentId,
  changes
) => {
  return extensionHost.invoke(
    'TextDocument.syncIncremental',
    textDocumentId,
    changes
  )
}

export const setLanguageId = (extensionHost, textDocumentId, languageId) => {
  return extensionHost.invoke(
    'TextDocument.setLanguageId',
    textDocumentId,
    languageId
  )
}
