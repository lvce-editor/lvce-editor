const PHASE_DEFAULT = 0
const PHASE_SHUTDOWN = -1

export const state = {
  phase: PHASE_DEFAULT,
}

export const isShutDown = () => {
  return state.phase === PHASE_SHUTDOWN
}

export const isDefault = () => {
  return state.phase === PHASE_DEFAULT
}

export const setShutDown = () => {
  state.phase = PHASE_SHUTDOWN
}

export const getPhase = () => {
  return state.phase
}
