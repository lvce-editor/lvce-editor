import * as LoadWindowsProcessTree from '../LoadWindowsProcessTree/LoadWindowsProcessTree.js'

/**
 *
 * @param {number} rootPid
 * @param {WindowsProcessTree.ProcessDataFlag} flags
 * @returns {Promise<WindowsProcessTree.IProcessInfo[] | undefined>}
 */
export const getProcessList = async (rootPid, flags) => {
  const WindowsProcessTree = await LoadWindowsProcessTree.loadWindowProcessTree()
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
  const WindowsProcessTree = await LoadWindowsProcessTree.loadWindowProcessTree()
  return new Promise((resolve) => {
    WindowsProcessTree.getProcessCpuUsage(processList, resolve)
  })
}
