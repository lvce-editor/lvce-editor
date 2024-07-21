import * as Rpc from '../Rpc/Rpc.ts'

export const setValue = async (value: string) => {
  await Rpc.invoke('Search.handleInput', value)
}
