import * as UpdateWorker from '../UpdateWorker/UpdateWorker.js'

export const getLatestVersion = () => {
  return UpdateWorker.invoke('Update.getLatestVersion', 'lvce-editor/lvce-editor')
}
