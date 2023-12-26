import { join } from 'path'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const getTypeScriptPath = () => {
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
