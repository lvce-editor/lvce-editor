import * as IsElectron from '../IsElectron/IsElectron.ts'

const getModule = (): any => {
  if (IsElectron.isElectron) {
    return import('../TrashElectron/TrashElectron.ts')
  }
  return import('../TrashNode/TrashNode.ts')
}

export const trash = async (path: any): Promise<any> => {
  const module = await getModule()
  await module.trash(path)
}
