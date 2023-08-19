import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const exit = () => {
  // TODO rename to Exit.exit
  return ParentIpc.invoke('App.exit')
}
