import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'

export const removeRipGrepFiles = async (to, platform, arch) => {
  await Remove.remove(Path.absolute(`${to}/node_modules/@lvce-editor/ripgrep/src/index.d.ts`))
  await Remove.remove(Path.absolute(`${to}/node_modules/@lvce-editor/ripgrep/src/postinstall.js`))
  await Remove.remove(Path.absolute(`${to}/node_modules/@lvce-editor/ripgrep/src/downloadRipGrep.js`))
  await Replace.replace({
    path: `${to}/node_modules/@lvce-editor/ripgrep/src/downloadRipGrep.js`,
    occurrence: `export { downloadRipGrep } from './downloadRipGrep.js'`,
    replacement: '',
  })
}
