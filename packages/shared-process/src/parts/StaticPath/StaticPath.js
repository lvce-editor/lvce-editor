import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as IsBuiltServer from '../IsBuiltServer/IsBuiltServer.js'
import * as Root from '../Root/Root.js'

export const getStaticPath = () => {
  if (IsBuiltServer.isBuiltServer) {
    // TODO maybe move static files to separate package
    const staticServerUri = fileURLToPath(import.meta.resolve('@lvce-editor/static-server'))
    const staticPath = join(staticServerUri, '..', '..', 'static')
    return staticPath
  }
  return join(Root.root, 'static')
}
