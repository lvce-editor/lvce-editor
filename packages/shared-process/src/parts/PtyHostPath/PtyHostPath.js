import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const getPtyHostPath = async () => {
  return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
}
