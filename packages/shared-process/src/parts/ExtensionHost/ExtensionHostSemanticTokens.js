export const executeSemanticTokenProvider = async (
  extensionHost,
  documentId
) => {
  const semanticTokens = await extensionHost.invoke(
    'SemanticTokens.execute',
    documentId
  )
  return semanticTokens
}
