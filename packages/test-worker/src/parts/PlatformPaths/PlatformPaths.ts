import * as Rpc from '../Rpc/Rpc.ts'

export const getNodePath = () => {
  return Rpc.invoke(/* Platform.getNodePath */ 'Platform.getNodePath')
}
