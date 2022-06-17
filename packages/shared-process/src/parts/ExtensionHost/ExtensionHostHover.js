export const executeHoverProvider = async (
  extensionHost,
  documentId,
  offset
) => {
  const hover = await extensionHost.invoke(
    'executeHoverProvider',
    documentId,
    offset
  )
  return hover
}
