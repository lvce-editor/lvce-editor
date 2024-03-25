import * as Rpc from '../Rpc/Rpc.ts'

export const focusNext = async () => {
  await Rpc.invoke('FindWidget.focusNext')
}

export const setValue = async (value) => {
  await Rpc.invoke('FindWidget.handleInput', value)
}
