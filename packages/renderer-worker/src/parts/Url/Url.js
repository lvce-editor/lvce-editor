export const createObjectUrl = (blob) => {
  return URL.createObjectURL(blob)
}

export const revokeObjectUrl = (url) => {
  return URL.revokeObjectURL(url)
}
