import * as Assert from '../Assert/Assert.ts'
import * as Callback from '../Callback/Callback.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const create = async (canvasId) => {
  Assert.number(canvasId)
  const { id, promise } = Callback.registerPromise()
  await Rpc.invoke('OffscreenCanvas.createForTerminal', canvasId, id)
  const response = await promise
  const canvas = response
  return canvas
}

export const handleResult = (id, result) => {
  Callback.resolve(id, result)
}
