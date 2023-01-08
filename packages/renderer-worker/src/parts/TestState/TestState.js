export const state = {
  /**
   * @type {any[]}
   */
  pendingTests: [],
  mockExec: undefined,
}

export const addTest = (name, fn) => {
  state.pendingTests.push({ name, fn })
}

export const getTests = () => {
  const tests = state.pendingTests
  state.pendingTests = []
  return tests
}

export const setMockExec = (fn) => {
  state.mockExec = fn
}

export const getMockExec = () => {
  return state.mockExec
}
