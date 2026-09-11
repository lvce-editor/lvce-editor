import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.js'
import * as Location from '../Location/Location.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const isActive = WorkspaceConnection.isActive

export const create = async (type) => {
  if (type === 'terminal-process' && (await ExtensionManagementWorker.invoke('Extensions.getWorkspaceTransportUri'))) {
    return { type: 'message-port' }
  }
  const remoteUrl = type === 'terminal-process' ? await WorkspaceConnection.getWebSocketUrl(type) : ''
  return {
    protocols: [],
    url: remoteUrl || GetWebSocketUrl.getWebSocketUrl(type, Location.getHost()),
  }
}
