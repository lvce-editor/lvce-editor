// listProcesses windows implementation based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

const WindowsProcessTree = require('windows-process-tree')
const { VError } = require('verror')
const Assert = require('../Assert/Assert.js')

/**
 *
 * @param {WindowsProcessTree.IProcessCpuInfo} process
 * @param {number } rootPid
 * @returns
 */
const findName = (process, rootPid) => {
  Assert.object(process)
  Assert.number(rootPid)
  if (process.pid === rootPid) {
    return 'main'
  }
  const cmd = process.commandLine
  if (!cmd) {
    return '<unknown>'
  }
  if (cmd.includes('--type=zygote')) {
    return 'zygote'
  }
  if (cmd.includes('--type=gpu-process')) {
    return 'gpu-process'
  }
  if (cmd.includes('--type=utility')) {
    return 'utility'
  }
  if (cmd.includes('extensionHostMain.js')) {
    return 'extension-host'
  }
  if (cmd.includes('--type=renderer')) {
    if (cmd.includes('--enable-sandbox')) {
      return 'renderer'
    }
    return 'chrome-devtools'
  }
  return `<unknown> ${cmd}`
}

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
    name: findName(item, rootPid),
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
