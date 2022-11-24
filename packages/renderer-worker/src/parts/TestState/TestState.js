export const state = {
  /**
   * @type {any[]}
   */
  pendingTests: [],
}

export const addTest = (name, fn) => {
  state.pendingTests.push({ name, fn })
}

export const getTests = () => {
  const tests = state.pendingTests
  state.pendingTests = []
  return tests
}
