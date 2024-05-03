import * as IsElectron from '../IsElectron/IsElectron.js'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'
import { VError } from '../VError/VError.js'

const getPtyHostPath = () => {
  return Path.join(Root.root, 'packages', 'pty-host')
}

const getModule = () => {
  if (IsElectron.isElectron()) {
    return import('../RebuildForElectron/RebuildForElectron.js')
  }
  return import('../RebuildForNode/RebuildForNode.js')
}

export const rebuildNodePty = async () => {
  try {
    const ptyHostPath = getPtyHostPath()
    const module = await getModule()
    await module.rebuild(ptyHostPath)
  } catch (error) {
    throw new VError(error, `Failed to rebuild node-pty`)
  }
}
