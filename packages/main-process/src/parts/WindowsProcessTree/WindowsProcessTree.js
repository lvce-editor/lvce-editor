const VError = require('verror')
const ErrorCodes = require('../ErrorCodes/ErrorCodes.js')

const loadWindowProcessTree = () => {
  try {
    return require('windows-process-tree')
  } catch (error) {
    if (error && error instanceof Error && 'code' in error && error.code === ErrorCodes.ERR_DLOPEN_FAILED) {
      throw new VError(
        `Failed to load windows process tree: The native module "windows-process-tree" is not compatible with this node version and must be compiled against a matching electron version using electron-rebuild`
      )
    }
    // @ts-ignore
    throw new VError(error, `Failed to load windows process tree`)
  }
}

/**
 *
 * @param {number} rootPid
 * @param {WindowsProcessTree.ProcessDataFlag} flags
 * @returns {Promise<WindowsProcessTree.IProcessInfo[] | undefined>}
 */
exports.getProcessList = (rootPid, flags) => {
  const WindowsProcessTree = loadWindowProcessTree()
  return new Promise((resolve, reject) => {
    WindowsProcessTree.getProcessList(rootPid, resolve, flags)
  })
}

/**
 *
 * @param {WindowsProcessTree.IProcessInfo[]} processList
 * @returns Promise< WindowsProcessTree.IProcessCpuInfo[]>
 */
exports.addCpuUsage = (processList) => {
  const WindowsProcessTree = loadWindowProcessTree()
  return new Promise((resolve) => {
    WindowsProcessTree.getProcessCpuUsage(processList, resolve)
  })
}
