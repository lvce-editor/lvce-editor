import type { SearchState } from './ViewletSearchTypes.ts'

export const renderActions = {
  isEqual(oldState: SearchState, newState: SearchState) {
    return oldState.actionsDom === newState.actionsDom
  },
  apply(oldState: SearchState, newState: SearchState) {
    return newState.actionsDom
  },
}
