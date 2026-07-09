import * as Path from '../Path/Path.ts'
import * as Root from '../Root/Root.ts'

export const previewProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'preview-process',
  'dist',
  'index.js',
)
