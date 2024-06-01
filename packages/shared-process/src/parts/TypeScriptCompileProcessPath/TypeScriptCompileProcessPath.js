import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const typescriptCompileProcessPath = Path.join(
  Root.root,
  'packages',
  'shared-process',
  'node_modules',
  '@lvce-editor',
  'typescript-compile-process',
  'src',
  'typescriptCompileProcessMain.js',
)
