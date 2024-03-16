import * as Rpc from '../Rpc/Rpc.js'

export const update = (settings) => {
  return Rpc.invoke('Preferences.update', settings)
}
