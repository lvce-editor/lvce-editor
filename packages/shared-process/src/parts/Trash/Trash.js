import * as IsElectron from '../IsElectron/IsElectron.js'
import { VError } from '../VError/VError.js'

const getModule = () => {
  if (IsElectron.isElectron) {
    return import('../TrashElectron/TrashElectron.js')
  }
  return import('../TrashNode/TrashNode.js')
}

export const trash = async (path) => {
  try {
    const module = await getModule()
    await module.trash(path)
  } catch (error) {
    throw new VError(error, 'Failed to move item to trash')
  }
}
