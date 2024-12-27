export const serializeHeaders = (headers) => {
  return Object.fromEntries(Array.from(headers.entries()))
}
