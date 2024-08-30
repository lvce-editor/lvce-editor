import * as Electron from 'electron'
import * as HandlePermission from '../HandlePermission/HandlePermission.js'
import * as HandleRequest from '../HandleRequest/HandleRequest.js'
import * as IsSessionCacheEnabled from '../IsSessionCacheEnabled/IsSessionCacheEnabled.js'
import * as Platform from '../Platform/Platform.js'
import * as Protocol from '../Protocol/Protocol.js'

// TODO maybe create a separate session for webviews
export const createElectronSession = () => {
  const sessionId = Platform.getSessionId()
  const session = Electron.session.fromPartition(sessionId, {
    cache: IsSessionCacheEnabled.isSessionCacheEnabled,
  })
  session.setPermissionRequestHandler(HandlePermission.handlePermissionRequest)
  session.setPermissionCheckHandler(HandlePermission.handlePermissionCheck)
  Protocol.handle(session.protocol, Platform.scheme, HandleRequest.handleRequest)
  return session
}
