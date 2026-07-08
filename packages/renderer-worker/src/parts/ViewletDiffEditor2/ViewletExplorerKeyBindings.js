import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'

const isDiffViewKeyBindingsNotFound = (error) => {
  return error instanceof Error && error.name === 'CommandNotFoundError' && error.message.includes('DiffView.getKeyBindings')
}

export const getKeyBindings = async () => {
  try {
    return await DiffViewWorker.invoke('DiffView.getKeyBindings')
  } catch (error) {
    if (isDiffViewKeyBindingsNotFound(error)) {
      return []
    }
    throw error
  }
}
