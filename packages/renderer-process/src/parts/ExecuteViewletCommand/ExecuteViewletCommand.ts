import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Assert from '../Assert/Assert.ts'

export const executeViewletCommand = (uid, command, ...args) => {
  Assert.number(uid)
  RendererWorker.send('Viewlet.executeViewletCommand', uid, command, ...args)
}
