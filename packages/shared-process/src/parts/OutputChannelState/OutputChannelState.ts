export const state: any = {
  outputChannels: Object.create(null),
}

export const set = (id: any, channel: any): any => {
  state.outputChannels[id] = channel
}

export const get = (id: any): any => {
  return state.outputChannels[id]
}

export const remove = (id: any): any => {
  delete state.outputChannels[id]
}

export const has = (id: any): any => {
  return id in state.outputChannels
}
