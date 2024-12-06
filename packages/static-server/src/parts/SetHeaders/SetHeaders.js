export const setHeaders = (response, headers) => {
  for (const [key, value] of Object.entries(headers)) {
    response.setHeader(key, value)
  }
}
