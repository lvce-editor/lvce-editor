/**
 *
 * @param {number} rootPid
 * @param {WindowsProcessTree.ProcessDataFlag} flags
 * @returns {Promise<WindowsProcessTree.IProcessInfo[] | undefined>}
 */
exports.getProcessList = (rootPid, flags) => {
  const WindowsProcessTree = require('windows-process-tree')
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
  const WindowsProcessTree = require('windows-process-tree')
  return new Promise((resolve) => {
    WindowsProcessTree.getProcessCpuUsage(processList, resolve)
  })
}

exports.ProcessDataFlag = {
  None: 0,
  Memory: 1,
  CommandLine: 2,
}
