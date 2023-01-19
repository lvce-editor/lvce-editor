export const deleteCharacterLeft = (state) => {
  const { value } = state
  if (value === '') {
    return state
  }
  return {
    ...state,
    value: value.slice(0, -1),
  }
}
