import * as Rpc from '../Rpc/Rpc.ts'

export const setValue = async (value) => {
  await Rpc.invoke('Search.handleInput', value)
}
