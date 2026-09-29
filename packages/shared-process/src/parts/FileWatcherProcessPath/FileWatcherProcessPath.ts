import * as Path from '../Path/Path.ts'
import * as Root from '../Root/Root.ts'

export const fileWatcherProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'file-watcher-process',
  'dist',
  'index.js',
)
