import * as Assert from '../Assert/Assert.js'

export const state = {
  /**
   * @type {any[]}
   */
  pendingTests: [],
  mockExec: undefined,
  mockRpcs: Object.create(null),
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

export const setMockRpc = (name, map) => {
  Assert.string(name)
  Assert.object(map)
  state.mockRpcs[name] = map
}

export const getMockRpc = (name) => {
  return state.mockRpcs[name]
}
