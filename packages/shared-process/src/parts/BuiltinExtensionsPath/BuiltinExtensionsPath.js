import { join } from 'path'
import { fileURLToPath } from 'url'

export const getBuiltinExtensionsPath = () => {
  const staticServerPath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server'))
  const builtinExtensionsPath = join(staticServerPath, '..', '..', 'static', 'commitHash', 'extensions')
  return builtinExtensionsPath
}
