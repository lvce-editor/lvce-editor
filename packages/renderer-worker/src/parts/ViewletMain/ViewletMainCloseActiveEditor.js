export const closeActiveEditor = (state) => {
  if (!state.activeEditor) {
  }
  return {
    newState: state,
    commands: [],
  }
}
