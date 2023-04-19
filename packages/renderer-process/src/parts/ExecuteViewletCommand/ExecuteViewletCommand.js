import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Assert from '../Assert/Assert.js'

export const executeViewletCommand = (uid, command, ...args) => {
  Assert.number(uid)
  RendererWorker.send('Viewlet.executeViewletCommand', uid, command, ...args)
}
