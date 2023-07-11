const PHASE_DEFAULT = 0
const PHASE_SHUTDOWN = -1

exports.state = {
  phase: PHASE_DEFAULT,
}

exports.isShutDown = () => {
  return exports.state.phase === PHASE_SHUTDOWN
}

exports.isDefault = () => {
  return exports.state.phase === PHASE_DEFAULT
}

exports.setShutDown = () => {
  exports.state.phase = PHASE_SHUTDOWN
}

exports.getPhase = () => {
  return exports.state.phase
}
