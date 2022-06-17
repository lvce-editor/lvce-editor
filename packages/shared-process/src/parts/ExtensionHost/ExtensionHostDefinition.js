export const executeDefinitionProvider = async (
  extensionHost,
  textDocumentId,
  offset
) => {
  const result = await extensionHost.invoke(
    'Definition.executeDefinitionProvider',
    textDocumentId,
    offset
  )
  return result
}
