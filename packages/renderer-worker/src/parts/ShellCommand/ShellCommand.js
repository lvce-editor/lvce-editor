import * as Notification from '../Notification/Notification.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getMenuEntries = async () => {
  if (Platform.getPlatform() !== PlatformType.Electron) {
    return []
  }
  return SharedProcess.invoke('ShellCommand.getMenuEntries')
}

export const install = async () => {
  try {
    const path = await SharedProcess.invoke('ShellCommand.install')
    await Notification.create('info', `Shell command installed at ${path}. Open a new terminal to use it.`)
  } catch (error) {
    await Notification.create('error', `Failed to install shell command: ${error instanceof Error ? error.message : String(error)}`)
  }
}
