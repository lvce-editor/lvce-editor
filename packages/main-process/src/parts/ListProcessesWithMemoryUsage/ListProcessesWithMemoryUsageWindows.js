// listProcesses windows implementation based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

// @ts-ignore
const WindowsProcessTree = require('windows-process-tree')
const { VError } = require('verror')
const ListProcessGetName = require('../ListProcessGetName/ListProcessGetName.js')

/**
 *
 * @param {number} rootPid
 * @param {WindowsProcessTree.ProcessDataFlag} flags
 * @returns {Promise<WindowsProcessTree.IProcessInfo[] | undefined>}
 */
const getProcessList = (rootPid, flags) => {
  return new Promise((resolve, reject) => {
    WindowsProcessTree.getProcessList(rootPid, resolve, flags)
  })
}

/**
 *
 * @param {WindowsProcessTree.IProcessInfo[]} processList
 * @returns Promise< WindowsProcessTree.IProcessCpuInfo[]>
 */
const addCpuUsage = (processList) => {
  return new Promise((resolve) => {
    WindowsProcessTree.getProcessCpuUsage(processList, resolve)
  })
}

/**
 * @param {WindowsProcessTree.IProcessCpuInfo} item
 * @param {number} rootPid
 */
const toResultItem = (item, rootPid) => {
  return {
    name: ListProcessGetName.getName(item.pid, item.commandLine, rootPid),
    pid: item.pid,
    ppid: item.ppid,
    memory: item.memory,
    cmd: item.commandLine,
  }
}

/**
 *
 * @param {WindowsProcessTree.IProcessCpuInfo[]} completeProcessList
 * @param {number} rootPid
 */
const toResult = (completeProcessList, rootPid) => {
  const results = []
  for (const item of completeProcessList) {
    results.push(toResultItem(item, rootPid))
  }
  return results
}

exports.listProcessesWithMemoryUsage = async (rootPid) => {
  const processList = await getProcessList(
    rootPid,
    WindowsProcessTree.ProcessDataFlag.CommandLine |
      WindowsProcessTree.ProcessDataFlag.Memory
  )
  if (!processList) {
    throw new VError(`Root process ${rootPid} not found`)
  }
  const completeProcessList = await addCpuUsage(processList)
  const result = toResult(completeProcessList, rootPid)
  return result
}
