import * as Command from '../Command/Command.js'
import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

const getPromptMessage = (version) => {
  return `Do you want to update to version ${version}?`
}

const getPromptRestart = () => {
  return `The Update has been downloaded. Do you want to restart now?`
}

export const checkForUpdates = async () => {
  const info = await ElectronProcess.invoke('AutoUpdater.checkForUpdatesAndNotify')
  if (info && info.version) {
    const message = getPromptMessage(info.version)
    const shouldUpdate = await Command.execute('ConfirmPrompt.prompt', message)
    if (!shouldUpdate) {
      return
    }
    await ElectronProcess.invoke('AutoUpdater.downloadUpdate', info.version)
    const messageRestart = getPromptRestart()
    const shouldRestart = await Command.execute('ConfirmPrompt.prompt', messageRestart)
    if (!shouldRestart) {
      return
    }
    await ElectronProcess.invoke('AutoUpdater.installAndRestart')
  }
  console.log({ info })
}
