export const executeBraceCompletionProvider = async (
  extensionHost,
  documentId,
  offset,
  openingBrace
) => {
  const completions = await extensionHost.invoke(
    'BraceCompletion.execute',
    documentId,
    offset,
    openingBrace
  )
  return completions
}
