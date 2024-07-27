import type { E2eTestState } from './ViewletE2eTestTypes.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderTests = {
  isEqual(oldState: E2eTestState, newState: E2eTestState) {
    return oldState.name === newState.name && oldState.index === newState.index
  },
  apply(oldState: E2eTestState, newState: E2eTestState) {
    const dom = []
    return ['Viewlet.setDom2', dom]
  },
}

const renderIframe = {
  isEqual(oldState: E2eTestState, newState: E2eTestState) {
    return oldState.iframeSrc === newState.iframeSrc && oldState.iframeSandbox === newState.iframeSandbox
  },
  apply(oldState: E2eTestState, newState: E2eTestState) {
    return ['setIframe', newState.iframeSrc, newState.iframeSandbox]
  },
}

export const render = [renderTests, renderIframe]
