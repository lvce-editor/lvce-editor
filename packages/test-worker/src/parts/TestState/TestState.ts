// @ts-nocheck

import * as Assert from '../Assert/Assert.ts'

const state = {
  /**
   * @type {any[]}
   */
  pendingTests: [],
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

export const setMockRpc = (mockRpc) => {
  Assert.object(mockRpc)
  Assert.string(mockRpc.name)
  state.mockRpcs[mockRpc.name] = mockRpc
}

export const getMockRpc = (name) => {
  return state.mockRpcs[name]
}
