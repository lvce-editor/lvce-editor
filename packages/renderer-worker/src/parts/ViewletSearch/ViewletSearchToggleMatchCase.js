export const toggleMatchCase = (state) => {
  const { matchCase } = state
  return {
    ...state,
    matchCase: !matchCase,
  }
}
