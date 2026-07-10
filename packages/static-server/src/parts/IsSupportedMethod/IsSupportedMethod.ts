export const isSupportedMethod = (method: string | undefined): boolean => {
  return method === 'GET' || method === 'HEAD'
}
