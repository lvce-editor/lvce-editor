import { VError } from '../VError/VError.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

const loadWindowProcessTree = async () => {
  try {
    return await import('windows-process-tree')
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
export const getProcessList = async (rootPid, flags) => {
  const WindowsProcessTree = await loadWindowProcessTree()
  return new Promise((resolve, reject) => {
    WindowsProcessTree.getProcessList(rootPid, resolve, flags)
  })
}

/**
 *
 * @param {WindowsProcessTree.IProcessInfo[]} processList
 * @returns Promise< WindowsProcessTree.IProcessCpuInfo[]>
 */
export const addCpuUsage = async (processList) => {
  const WindowsProcessTree = await loadWindowProcessTree()
  return new Promise((resolve) => {
    WindowsProcessTree.getProcessCpuUsage(processList, resolve)
  })
}
