import * as Path from '../Path/Path.cjs'
import * as Root from '../Root/Root.cjs'

export const getTerminalProcessPath = () => {
  return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
}
