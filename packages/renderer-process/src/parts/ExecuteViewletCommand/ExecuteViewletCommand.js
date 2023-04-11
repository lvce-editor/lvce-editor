import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const executeViewletCommand = (uid, command, ...args) => {
  RendererWorker.send('Viewlet.executeViewletCommand', uid, 'uid', uid, command, ...args)
}
