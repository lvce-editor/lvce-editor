import * as TaskWorker from '../TaskWorker/TaskWorker.js'
import * as Disk from '../FileSystem/FileSystemDisk.js'
import * as Notification from '../Notification/Notification.js'
import * as Command from '../Command/Command.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as WorkspaceState from '../WorkspaceState/WorkspaceState.js'

export const runDefaultBuildTask = async () => {
  const { workspacePath, pathSeparator } = WorkspaceState.state
  if (!workspacePath) {
    await Notification.create('error', 'Open a workspace before running its default build task.')
    return
  }

  const taskConfigurationPath = `${workspacePath}${pathSeparator}.lvce${pathSeparator}tasks.json`
  let task
  try {
    const content = await Disk.readFile(taskConfigurationPath)
    task = await TaskWorker.invoke('Task.getDefaultBuildTask', content)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const description = message.includes('ENOENT')
      ? `No task configuration found at .lvce/tasks.json in ${workspacePath}.`
      : `Unable to run the default build task: ${message}`
    await Notification.create('error', description)
    return
  }

  try {
    await Command.execute('Layout.openIntegratedTerminal', workspacePath)
    await ViewletManager.waitForLoadContentLater(ViewletModuleId.Terminals)
    const commandLine = await TaskWorker.invoke('Task.getCommandLine', task)
    await Command.execute('Terminals.sendText', `${commandLine}\r`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await Notification.create('error', `Unable to start the default build task: ${message}`)
  }
}
