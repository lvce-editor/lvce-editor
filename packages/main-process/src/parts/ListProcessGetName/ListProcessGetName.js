const { BrowserWindow } = require('electron')
const Assert = require('../Assert/Assert.js')
const CreatePidMap = require('../CreatePidMap/CreatePidMap.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')
const UtilityProcessState = require('../UtilityProcessState/UtilityProcessState.js')

exports.getName = (pid, cmd, rootPid) => {
  Assert.object(process)
  Assert.number(rootPid)
  const browserWindows = BrowserWindow.getAllWindows()
  const browserViews = ElectronBrowserViewState.getAll()
  const utilityProcesses = UtilityProcessState.getAll()
  const pidMap = CreatePidMap.createPidMap(browserWindows, browserViews, utilityProcesses)
  if (pid === rootPid) {
    return 'main'
  }
  if (cmd.includes('--type=zygote')) {
    return 'zygote'
  }
  if (cmd.includes('--type=gpu-process')) {
    return 'gpu-process'
  }

  if (cmd.includes('extensionHostMain.js')) {
    return 'extension-host'
  }
  if (cmd.includes('ptyHostMain.js')) {
    return 'pty-host'
  }
  if (cmd.includes('--lvce-window-kind=process-explorer')) {
    return 'process-explorer'
  }
  if (pid in pidMap) {
    return pidMap[pid] || `<unknown>`
  }
  if (cmd.includes('--type=renderer')) {
    return `<unknown renderer>`
  }
  if (cmd.includes('--type=utility')) {
    return 'utility'
  }
  if (cmd.includes('typescript/lib/tsserver.js')) {
    return 'tsserver.js'
  }
  if (cmd.includes('typescript/lib/typingsInstaller.js')) {
    return 'typingsInstaller.js'
  }
  if (cmd.includes('extensionHostHelperProcessMain.js')) {
    return 'extension-host-helper-process'
  }
  if (cmd.startsWith('bash')) {
    return 'bash'
  }
  return `${cmd}`
}
