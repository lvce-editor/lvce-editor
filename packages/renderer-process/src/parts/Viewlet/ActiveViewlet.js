export const state = {
  viewletStates: Object.create(null),
}

const getTarget = (event) => {
  const $Target = event.target
  const $WantedTarget = $Target.closest('.Viewlet')
  return $WantedTarget
}

export const getStateFromEvent = (event) => {
  const $Target = getTarget(event)
  if (!$Target) {
    console.warn('invalid handler')
    return undefined
  }
  const id = $Target.dataset.viewletId
  const viewletState = state.viewletStates[id]
  return viewletState
}

// TODO test deleteState function
export const deleteState = (id) => {
  delete state.viewletStates[id]
}

export const setState = (id, viewletState) => {
  state.viewletStates[id] = viewletState
}

export const getState = (id) => {
  return state.viewletStates[id]
}
