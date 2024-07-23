import type { E2eState } from './ViewletE2eTestsTypes.ts'

export const create = (): E2eState => {
  return {
    tests: [],
  }
}

export const loadContent = async (state: E2eState): Promise<E2eState> => {
  const tests = ['1', '2', '3']
  return {
    ...state,
    tests,
  }
}
