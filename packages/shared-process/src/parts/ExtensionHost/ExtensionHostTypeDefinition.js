export const executeTypeDefinitionProvider = async (
  extensionHost,
  textDocumentId,
  offset
) => {
  const result = await extensionHost.invoke(
    'TypeDefinition.execute',
    textDocumentId,
    offset
  )
  return result
}
