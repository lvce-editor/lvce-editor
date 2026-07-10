import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import * as Platform from '../Platform/Platform.js'

export const showAbout = async () => {
  await AboutViewWorker.invoke('About.showAbout', Platform.getPlatform())
}
