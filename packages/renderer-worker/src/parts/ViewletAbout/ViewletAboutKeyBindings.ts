import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'

export const getKeyBindings = () => {
  return AboutViewWorker.invoke('About.getKeyBindings')
}
