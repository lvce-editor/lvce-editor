import * as Rpc from '../Rpc/Rpc.js'

export const set = async (url, contentSecurityPolicy) => {
  const pathName = new URL(url).pathname
  await Rpc.invoke('ExtensionHostWorkerContentSecurityPolicy.set', pathName, contentSecurityPolicy)
}
