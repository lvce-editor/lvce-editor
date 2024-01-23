export const create = (uid) => {
  return {
    uid,
    text: '',
    inputValue: '',
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    text: 'Debug Console (not implemented)',
  }
}

export const handleInput = (state, value) => {
  return {
    ...state,
    inputValue: value,
  }
}

export const evaluate = (state) => {
  const { inputValue } = state
  // TODO evaluate input value
  console.log({ inputValue })
  return state
}
