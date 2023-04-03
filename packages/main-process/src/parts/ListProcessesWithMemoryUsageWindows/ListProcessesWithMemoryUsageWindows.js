// listProcesses windows implementation based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

const { VError } = require('verror')
const ListProcessGetName = require('../ListProcessGetName/ListProcessGetName.js')
const WindowsProcessTree = require('../WindowsProcessTree/WindowsProcessTree.js')

/**
 * @param {import('windows-process-tree').IProcessCpuInfo} item
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
 * @param {import('windows-process-tree').IProcessCpuInfo[]} completeProcessList
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
  try {
    const processList = await WindowsProcessTree.getProcessList(
      rootPid,
      WindowsProcessTree.ProcessDataFlag.CommandLine |
        WindowsProcessTree.ProcessDataFlag.Memory
    )
    if (!processList) {
      throw new VError(`Root process ${rootPid} not found`)
    }
    const completeProcessList = await WindowsProcessTree.addCpuUsage(
      processList
    )
    const result = toResult(completeProcessList, rootPid)
    return result
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to list processes`)
  }
}
