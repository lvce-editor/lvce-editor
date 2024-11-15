import { dirname, join } from 'node:path'
import * as IsBuiltServer from '../IsBuiltServer/IsBuiltServer.js'
import * as Root from '../Root/Root.js'
import { fileURLToPath } from 'node:url'

export const getStaticPath = () => {
  if (IsBuiltServer.isBuiltServer) {
    // TODO maybe move static files to separate package
    const serverIndexUri = import.meta.resolve('@lvce-editor/server')
    const serverIndexPath = fileURLToPath(serverIndexUri)
    const serverPath = dirname(serverIndexPath)
    const staticPath = join(serverPath, 'static')
    return staticPath
  }
  return join(Root.root, 'static')
}
