export const executeClosingTagProvider = async (
  extensionHost,
  documentId,
  offset,
  openingBrace
) => {
  const completions = await extensionHost.invoke(
    'ClosingTag.execute',
    documentId,
    offset,
    openingBrace
  )
  return completions
}
