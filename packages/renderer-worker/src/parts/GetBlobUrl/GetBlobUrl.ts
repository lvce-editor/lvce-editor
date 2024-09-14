export const getBlobUrl = (content: string, contentType: string): string => {
  const blob = new Blob([content], {
    type: contentType,
  })
  const url = URL.createObjectURL(blob) // TODO dispose
  return url
}
