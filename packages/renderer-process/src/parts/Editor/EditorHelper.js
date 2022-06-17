export const state = {
  editorStates: Object.create(null),
}

const get$EditorFromEvent = (event) => {
  const $Target = event.target
  const $WantedTarget = $Target.closest('.Editor')
  return $WantedTarget
}

export const getStateFromEvent = (event) => {
  const $Editor = get$EditorFromEvent(event)
  // TODO find more efficient way
  for (const [key, value] of Object.entries(state.editorStates)) {
    if (value.$Editor === $Editor) {
      return value
    }
  }
  return undefined
}

export const getStateFromId = (id) => {
  return state.editorStates[id]
}

export const setState = (id, editorState) => {
  state.editorStates[id] = editorState
}
