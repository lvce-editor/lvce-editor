export const state = {
  outputChannels: Object.create(null),
}

export const set = (id, channel) => {
  state.outputChannels[id] = channel
}

export const get = (id) => {
  return state.outputChannels[id]
}

export const remove = (id) => {
  delete state.outputChannels[id]
}

export const has = (id) => {
  return id in state.outputChannels
}
