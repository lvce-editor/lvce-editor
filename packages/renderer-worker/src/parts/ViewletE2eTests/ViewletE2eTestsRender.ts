import * as GetE2eTestsVirtualDom from '../GetE2eTestsVirtualDom/GetE2eTestsVirtualDom.ts'
import type { E2eState } from './ViewletE2eTestsTypes.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderTests = {
  isEqual(oldState: E2eState, newState: E2eState) {
    return oldState.tests === newState.tests
  },
  apply(oldState: E2eState, newState: E2eState) {
    const dom = GetE2eTestsVirtualDom.getE2eTestsVirtualDom(newState.tests)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderTests]
