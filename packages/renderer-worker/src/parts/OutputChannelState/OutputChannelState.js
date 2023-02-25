export const state = {
  outputChannels: Object.create(null),
}

export const set = (id, outputChannel) => {
  state.outputChannels[id] = outputChannel
}

export const get = (id) => {
  return state.outputChannels[id]
}

export const remove = (id) => {
  delete state.outputChannels[id]
}
