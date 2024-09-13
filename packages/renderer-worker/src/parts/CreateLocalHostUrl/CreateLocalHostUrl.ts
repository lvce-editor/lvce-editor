import * as CreateUrl from '../CreateUrl/CreateUrl.ts'

export const createLocalHostUrl = (locationProtocol: string, locationHost: string, isGitpod: boolean, webViewPort: number) => {
  if (isGitpod) {
    return CreateUrl.createUrl(locationProtocol, locationHost.replace('3000', `${webViewPort}`))
  }
  return `http://localhost:${webViewPort}`
}
