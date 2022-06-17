export const executeCompletionProvider = async (
  extensionHost,
  documentId,
  offset
) => {
  const completions = await extensionHost.invoke(
    'executeCompletionProvider',
    documentId,
    offset
  )
  return completions
}
