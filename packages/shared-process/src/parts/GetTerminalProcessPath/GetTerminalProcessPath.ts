import * as Path from '../Path/Path.ts'
import * as Root from '../Root/Root.ts'

export const getTerminalProcessPath = (): any => {
  return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
}
