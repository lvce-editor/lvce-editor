import * as UpdateWorker from '../UpdateWorker/UpdateWorker.js'

export const checkForUpdates = async (updateSetting) => {
  const repository = 'lvce-editor/lvce-editor'
  await UpdateWorker.invoke('Update.checkForUpdates', updateSetting, repository)
}
