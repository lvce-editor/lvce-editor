import * as Rpc from '../Rpc/Rpc.ts'

export const update = (settings: any) => {
  return Rpc.invoke('Preferences.update', settings)
}
