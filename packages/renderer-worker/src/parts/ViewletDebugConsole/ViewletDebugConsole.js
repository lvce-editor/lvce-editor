export const create = (uid) => {
  return {
    uid,
    text: '',
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    text: 'Debug Console (not implemented)',
  }
}
