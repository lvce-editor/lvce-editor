export const format = async (extensionHost, path, content) => {
  const formattedContent = await extensionHost.invoke('format', path, content)
  return formattedContent
}
