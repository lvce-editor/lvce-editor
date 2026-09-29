import * as Path from '../Path/Path.ts'
import * as Root from '../Root/Root.ts'

export const searchProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'search-process',
  'dist',
  'index.js',
)
