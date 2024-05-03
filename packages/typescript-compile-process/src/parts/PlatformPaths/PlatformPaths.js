import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const getBuiltinExtensionsPath = () => {
  return process.env.BUILTIN_EXTENSIONS_PATH || Path.join(Root.root, 'extensions')
}
