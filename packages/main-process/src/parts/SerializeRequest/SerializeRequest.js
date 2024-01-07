/**
 *
 * @param {Headers} headers
 */
const serializeRequestHeaders = (headers) => {
  return Object.fromEntries(headers)
}

/**
 *
 * @param {Request} request
 */
export const serializeRequest = (request) => {
  return {
    url: request.url,
    headers: serializeRequestHeaders(request.headers),
  }
}
