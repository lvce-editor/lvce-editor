import * as CreateUrl from '../CreateUrl/CreateUrl.ts'

export const getWebViewFrameAncestors = (locationProtocol, locationHost) => {
  const frameAncestors = CreateUrl.createUrl(locationProtocol, locationHost)
  return frameAncestors
}
