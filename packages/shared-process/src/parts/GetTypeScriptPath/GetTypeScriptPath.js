import { join } from 'node:path'
import * as IsBuiltServer from '../IsBuiltServer/IsBuiltServer.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as Platform from '../Platform/Platform.js'
import { pathToFileURL } from 'node:url'

export const getTypeScriptUri = () => {
  if (!Platform.isProduction || IsBuiltServer.isBuiltServer) {
    return 'typescript'
  }
  const typescriptPath = join(
    PlatformPaths.getBuiltinExtensionsPath(),
    'builtin.language-features-typescript',
    'node',
    'node_modules',
    'typescript',
    'lib',
    'typescript.js',
  )
  const typescriptUri = pathToFileURL(typescriptPath).toString()
  return typescriptUri
}
