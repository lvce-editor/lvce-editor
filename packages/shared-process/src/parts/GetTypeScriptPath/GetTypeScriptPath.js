import { join } from 'path'
import * as Root from '../Root/Root.js'

export const getTypeScriptPath = () => {
  return join(Root.root, 'extensions', 'builtin.language-features-typescript', 'node', 'node_modules', 'typescript', 'lib', 'typescript.js')
}
