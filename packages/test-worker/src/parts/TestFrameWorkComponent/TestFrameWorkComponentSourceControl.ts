import * as Rpc from '../Rpc/Rpc.ts'

export const acceptInput = async () => {
  await Rpc.invoke('Source Control.acceptInput')
}

export const handleInput = async (text) => {
  await Rpc.invoke('Source Control.handleInput', text)
}
