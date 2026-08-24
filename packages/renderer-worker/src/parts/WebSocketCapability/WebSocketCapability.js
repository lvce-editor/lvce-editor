import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.js'
import * as Location from '../Location/Location.js'
import * as WorkspaceBackend from '../WorkspaceBackend/WorkspaceBackend.js'

export const create = async (type) => {
  const remoteUrl = await WorkspaceBackend.getWebSocketUrl(type)
  return {
    protocols: [],
    url: remoteUrl || GetWebSocketUrl.getWebSocketUrl(type, Location.getHost()),
  }
}
