import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const launchWorker = async ({ name, url }) => {
  const worker = await IpcParent.create({
    method: IpcParentType.Auto,
    url,
    name,
  })
  return worker
}
