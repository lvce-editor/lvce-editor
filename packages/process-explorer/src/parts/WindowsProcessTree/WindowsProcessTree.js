import * as LoadWindowsProcessTree from '../LoadWindowsProcessTree/LoadWindowsProcessTree.js'
import * as Promises from '../Promises/Promises.js'

/**
 *
 * @param {number} rootPid
 * @param {number} flags
 * @returns {Promise<any[] | undefined>}
 */
export const getProcessList = async (rootPid, flags) => {
  const WindowsProcessTree = await LoadWindowsProcessTree.loadWindowProcessTree()
  const { resolve, promise } = Promises.withResolvers()
  WindowsProcessTree.getProcessList(rootPid, resolve, flags)
  return promise
}

/**
 *
 * @param {any[]} processList
 * @returns Promise< WindowsProcessTree.IProcessCpuInfo[]>
 */
export const addCpuUsage = async (processList) => {
  const WindowsProcessTree = await LoadWindowsProcessTree.loadWindowProcessTree()
  const { resolve, promise } = Promises.withResolvers()
  WindowsProcessTree.getProcessCpuUsage(processList, resolve)
  return promise
}
