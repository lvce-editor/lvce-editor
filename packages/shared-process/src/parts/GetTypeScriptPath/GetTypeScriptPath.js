import { join } from 'node:path'
import * as IsBuiltServer from '../IsBuiltServer/IsBuiltServer.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const getTypeScriptPath = () => {
  if (IsBuiltServer.isBuiltServer) {
    return 'typescript'
  }
  return join(
    PlatformPaths.getBuiltinExtensionsPath(),
    'builtin.language-features-typescript',
    'node',
    'node_modules',
    'typescript',
    'lib',
    'typescript.js',
  )
}
