import { join } from 'node:path'
import * as Root from '../Root/Root.js'

export const getPreloadUrl = () => {
  return join(Root.root, 'packages', 'shared-process', 'node_modules', '@lvce-editor', 'preload', 'src', 'index.js')
}
