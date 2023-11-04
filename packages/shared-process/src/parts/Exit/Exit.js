import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const exit = () => {
  return ParentIpc.invoke('Exit.exit')
}
