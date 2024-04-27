import { join } from 'node:path'
import * as Root from '../Root/Root.js'

export const preloadUrl = join(Root.root, 'packages', 'main-process', 'src', 'preload.js')
