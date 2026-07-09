import * as Path from '../Path/Path.ts'
import * as Root from '../Root/Root.ts'

export const embedsProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'embeds-process',
  'dist',
  'embedsProcessMain.js',
)
