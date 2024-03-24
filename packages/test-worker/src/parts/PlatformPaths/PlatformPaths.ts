import * as Rpc from '../Rpc/Rpc.js'

export const getNodePath = () => {
  return Rpc.invoke(/* Platform.getNodePath */ 'Platform.getNodePath')
}
