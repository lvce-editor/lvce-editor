import * as Path from '../Path/Path.ts'
import * as Root from '../Root/Root.ts'

export const fileSystemProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'file-system-process',
  'dist',
  'index.js',
)
