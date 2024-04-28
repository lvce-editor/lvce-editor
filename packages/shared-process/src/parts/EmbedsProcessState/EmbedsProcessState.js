import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.js'

const state = {
  ref: 0,
}

export const increment = () => {
  state.ref++
}

export const decrement = async () => {
  state.ref--
  if (state.ref === 0) {
    const promise = EmbedsProcess.state.ipc
    EmbedsProcess.state.ipc = undefined
    const ipc = await promise
    ipc.dispose()
  }
}
