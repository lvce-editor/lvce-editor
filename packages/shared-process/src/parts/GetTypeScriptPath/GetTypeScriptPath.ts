import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as BuiltinExtensionsPath from '../BuiltinExtensionsPath/BuiltinExtensionsPath.ts'
import * as IsBuiltServer from '../IsBuiltServer/IsBuiltServer.ts'
import * as IsProduction from '../IsProduction/IsProduction.ts'

export const getTypeScriptUri = (): any => {
  if (!IsProduction.isProduction || IsBuiltServer.isBuiltServer) {
    return 'typescript'
  }
  const typescriptPath = join(
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
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
