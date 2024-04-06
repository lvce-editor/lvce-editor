import * as Rpc from '../Rpc/Rpc.ts'

export const update = (settings) => {
  return Rpc.invoke('Preferences.update', settings)
}
