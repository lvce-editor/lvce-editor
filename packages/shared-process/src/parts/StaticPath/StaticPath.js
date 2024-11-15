import { dirname, join } from 'node:path'
import * as IsBuiltServer from '../IsBuiltServer/IsBuiltServer.js'
import * as Root from '../Root/Root.js'

export const getStaticPath = () => {
  if (IsBuiltServer.isBuiltServer) {
    // TODO maybe move static files to separate package
    const serverIndexPath = import.meta.resolve('@lvce-editor/server')
    const serverPath = dirname(serverIndexPath)
    const staticPath = join(serverPath, 'static')
    return staticPath
  }
  return join(Root.root, 'static')
}
