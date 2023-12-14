import { join } from 'node:path'
import * as Root from '../Root/Root.js'

export const getPreloadUrl = () => {
  return join(Root.root, 'packages', 'main-process', 'src', 'preload.js')
}
