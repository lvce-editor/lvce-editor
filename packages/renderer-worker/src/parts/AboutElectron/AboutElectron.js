import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'

export const showAboutElectron = async () => {
  return AboutViewWorker.invoke('About.showAboutElectron')
}
