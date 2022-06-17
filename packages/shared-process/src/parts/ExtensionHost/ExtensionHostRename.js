export const executePrepareRename = async (
  extensionHost,
  documentId,
  offset
) => {
  const result = await extensionHost.invoke(
    'Rename.executePrepareRename',
    documentId,
    offset
  )
  return result
}

export const executeRename = async (
  extensionHost,
  documentId,
  offset,
  newName
) => {
  const result = await extensionHost.invoke(
    'Rename.executeRename',
    documentId,
    offset,
    newName
  )
  return result
}
