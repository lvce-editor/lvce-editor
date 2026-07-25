import * as DialogWorker from '../DialogWorker/DialogWorker.js'

export const create = (id) => {
  return {
    id,
    commands: [],
  }
}

export const loadContent = async (state, savedState, options) => {
  const { id } = state
  await DialogWorker.invoke('Dialog.create', id)
  await DialogWorker.invoke('Dialog.loadContent2', id, options)
  const diffResult = await DialogWorker.invoke('Dialog.diff2', id)
  const commands = await DialogWorker.invoke('Dialog.render2', id, diffResult)
  return {
    ...state,
    commands,
  }
}

export const dispose = async (state) => {
  await DialogWorker.invoke('Dialog.dispose', state.id)
}
