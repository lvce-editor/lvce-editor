export const state = {
  listenerMap: Object.create(null),
  phase: 0,
}

export const PHASE_ZERO = 0
export const PHASE_ONE = 1
export const PHASE_TWO = 2
export const PHASE_THREE = 3
export const PHASE_FOUR = 4
export const PHASE_FIVE = 5
export const PHASE_SIX = 6
export const PHASE_SEVEN = 7
export const PHASE_EIGHT = 8
export const PHASE_NINE = 9
export const PHASE_TEN = 10
export const PHASE_ELEVEN = 11
export const PHASE_TWELVE = 12
export const PHASE_THIRTEEN = 13
export const PHASE_FOURTEEN = 14
export const PHASE_FIFTEEN = 15
export const PHASE_SIXTEEN = 16
export const PHASE_SEVENTEEN = 17

export const once = (event, listener) => {
  if (state.phase >= event) {
    listener()
  } else {
    // TODO could also statically allocate listenermap at start as array[13]
    state.listenerMap[event] ||= []
    state.listenerMap[event].push(listener)
  }
}

export const mark = (event) => {
  const listeners = state.listenerMap[event] || []
  for (const listener of listeners) {
    listener()
  }
  state.phase = event
  if (event === PHASE_TWELVE) {
    state.listenerMap = Object.create(null)
  }
}
