import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.js'
import * as Location from '../Location/Location.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const isActive = WorkspaceConnection.isActive

export const create = async (type) => {
  const remoteUrl = await WorkspaceConnection.getWebSocketUrl(type)
  return {
    protocols: [],
    url: remoteUrl || GetWebSocketUrl.getWebSocketUrl(type, Location.getHost()),
  }
}
