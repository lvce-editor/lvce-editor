export const executeTabCompletionProvider = async (
  extensionHost,
  documentId,
  offset
) => {
  const tabCompletion = await extensionHost.invoke(
    'executeTabCompletionProvider',
    documentId,
    offset
  )
  return tabCompletion
}
