import * as Rpc from '../Rpc/Rpc.js'

export const setValue = async (value) => {
  await Rpc.invoke('Search.handleInput', value)
}
