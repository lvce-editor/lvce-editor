// listProcesses windows implementation based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

import { VError } from '../VError/VError.js'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.js'
import * as WindowsProcessTree from '../WindowsProcessTree/WindowsProcessTree.js'
import * as WindowsProcessTreeDataFlag from '../WindowsProcessTreeDataFlag/WindowsProcessTreeDataFlag.js'
import * as CreatePidMap from '../CreatePidMap/CreatePidMap.js'

/**
 * @param {import('@vscode/windows-process-tree').IProcessCpuInfo} item
 * @param {number} rootPid
 * @param {object} pidMap
 */
const toResultItem = (item, rootPid, pidMap) => {
  return {
    name: ListProcessGetName.getName(item.pid, item.commandLine, rootPid, pidMap),
    pid: item.pid,
    ppid: item.ppid,
    memory: item.memory,
    cmd: item.commandLine,
  }
}

/**
 *
 * @param {import('@vscode/windows-process-tree').IProcessCpuInfo[]} completeProcessList
 * @param {number} rootPid
 */
const toResult = (completeProcessList, rootPid, pidMap) => {
  const results = []
  for (const item of completeProcessList) {
    results.push(toResultItem(item, rootPid, pidMap))
  }
  return results
}

export const listProcessesWithMemoryUsage = async (rootPid) => {
  try {
    const processList = await WindowsProcessTree.getProcessList(rootPid, WindowsProcessTreeDataFlag.CommandLine | WindowsProcessTreeDataFlag.Memory)
    if (!processList) {
      throw new VError(`Root process ${rootPid} not found`)
    }
    const pidMap = await CreatePidMap.createPidMap()
    const completeProcessList = await WindowsProcessTree.addCpuUsage(processList)
    const result = toResult(completeProcessList, rootPid, pidMap)
    return result
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to list processes`)
  }
}
