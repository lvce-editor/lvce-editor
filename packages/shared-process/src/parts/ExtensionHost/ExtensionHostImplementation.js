export const executeImplementationProvider = async (
  extensionHost,
  documentId,
  offset
) => {
  const implementations = await extensionHost.invoke(
    'Implementation.execute',
    documentId,
    offset
  )
  return implementations
}
