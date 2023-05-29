// listProcesses windows implementation based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

import { VError } from '../VError/VError.js'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.js'
import * as WindowsProcessTree from '../WindowsProcessTree/WindowsProcessTree.js'
import * as WindowsProcessTreeDataFlag from '../WindowsProcessTreeDataFlag/WindowsProcessTreeDataFlag.js'

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

export const listProcessesWithMemoryUsage = async (rootPid) => {
  try {
    const processList = await WindowsProcessTree.getProcessList(rootPid, WindowsProcessTreeDataFlag.CommandLine | WindowsProcessTreeDataFlag.Memory)
    if (!processList) {
      throw new VError(`Root process ${rootPid} not found`)
    }
    const completeProcessList = await WindowsProcessTree.addCpuUsage(processList)
    const result = toResult(completeProcessList, rootPid)
    return result
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to list processes`)
  }
}
