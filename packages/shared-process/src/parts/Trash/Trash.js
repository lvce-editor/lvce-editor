import * as IsElectron from '../IsElectron/IsElectron.js'

const getModule = () => {
  if (IsElectron.isElectron) {
    return import('../TrashElectron/TrashElectron.js')
  }
  return import('../TrashNode/TrashNode.js')
}

export const trash = async (path) => {
  const module = await getModule()
  await module.trash(path)
}
