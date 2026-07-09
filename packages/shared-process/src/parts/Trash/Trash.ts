import * as IsElectron from '../IsElectron/IsElectron.ts'

const getModule = () => {
  if (IsElectron.isElectron) {
    return import('../TrashElectron/TrashElectron.ts')
  }
  return import('../TrashNode/TrashNode.ts')
}

export const trash = async (path) => {
  const module = await getModule()
  await module.trash(path)
}
