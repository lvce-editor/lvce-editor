import type { RunningExtensionsState } from './ViewletRunningExtensionsTypes.ts'

export const renderTitle = {
  isEqual(oldState: RunningExtensionsState, newState: RunningExtensionsState): boolean {
    return oldState.title === newState.title
  },
  apply(_oldState: RunningExtensionsState, newState: RunningExtensionsState): string {
    return newState.title
  },
}
