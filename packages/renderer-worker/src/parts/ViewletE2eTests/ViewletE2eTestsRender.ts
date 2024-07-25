import * as GetE2eTestsVirtualDom from '../GetE2eTestsVirtualDom/GetE2eTestsVirtualDom.ts'
import * as GetVisibleE2eTests from '../GetVisibleE2eTests/GetVisibleE2eTests.ts'
import type { E2eState } from './ViewletE2eTestsTypes.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderTests = {
  isEqual(oldState: E2eState, newState: E2eState) {
    return oldState.tests === newState.tests && oldState.index === newState.index
  },
  apply(oldState: E2eState, newState: E2eState) {
    const visible = GetVisibleE2eTests.getVisibleE2eTests(newState.tests, newState.index)
    const dom = GetE2eTestsVirtualDom.getE2eTestsVirtualDom(visible)
    return ['Viewlet.setDom2', dom]
  },
}

const renderIframe = {
  isEqual(oldState: E2eState, newState: E2eState) {
    return oldState.iframeSrc === newState.iframeSrc && oldState.sandbox === newState.sandbox
  },
  apply(oldState: E2eState, newState: E2eState) {
    return ['setIframe', newState.iframeSrc, newState.sandbox]
  },
}

export const render = [renderTests, renderIframe]
