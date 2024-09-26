// TODO names this method
// - getRemoteUrl
// - getBlobUrl
// - getObjectUrl
// - FileSystem.readAsBlob

// TODO when returning an objectUrl in web, provide a way to dispose the object url

export const getRemoteUrl = (uri: string) => {
  return `/remote/${uri}`
}
