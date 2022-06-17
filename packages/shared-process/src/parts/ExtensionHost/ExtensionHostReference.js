export const executeReferenceProvider = async (
  extensionHost,
  documentId,
  offset
) => {
  const references = await extensionHost.invoke(
    'References.execute',
    documentId,
    offset
  )
  return references
}
