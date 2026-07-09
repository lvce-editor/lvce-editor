export const setHeaders = (response: any, headers: any): any => {
  for (const [key, value] of Object.entries(headers)) {
    response.setHeader(key, value)
  }
}
