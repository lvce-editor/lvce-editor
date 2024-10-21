import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'

export const getDetailString = async () => {
  return AboutViewWorker.invoke('About.getDetailString')
}
