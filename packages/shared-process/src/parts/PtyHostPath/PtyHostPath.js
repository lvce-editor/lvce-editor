import * as Root from '../Root/Root.js'
import * as Path from '../Path/Path.js'

export const getPtyHostPath = async () => {
  try {
    const { ptyHostPath } = await import('@lvce-editor/pty-host')
    return ptyHostPath
  } catch {
    return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
  }
}
