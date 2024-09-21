import type { ViewletWebViewState } from './ViewletWebViewState.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderIframe = {
  isEqual(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    return (
      oldState.x === newState.x &&
      oldState.y === newState.y &&
      oldState.width === newState.width &&
      oldState.height === newState.height &&
      oldState.csp === newState.csp &&
      oldState.origin === newState.origin
    )
  },
  apply(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    return ['setPosition', newState.id, newState.x, newState.y, newState.width, newState.height]
  },
}

export const render = [renderIframe]
