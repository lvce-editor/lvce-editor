export const getBlobUrl = async (content: string, contentType: string) => {
  const blob = new Blob([content], {
    type: 'text/html',
  })
  const url = URL.createObjectURL(blob) // TODO dispose
  return url
}
