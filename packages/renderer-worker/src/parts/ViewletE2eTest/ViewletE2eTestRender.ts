import type { E2eTestState } from './ViewletE2eTestTypes.ts'
import * as GetE2eTestVirtualDom from '../GetE2eTestVirtualDom/GetE2eTestVirtualDom.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderTests = {
  isEqual(oldState: E2eTestState, newState: E2eTestState) {
    return oldState.name === newState.name && oldState.content === newState.content
  },
  apply(oldState: E2eTestState, newState: E2eTestState) {
    const dom = GetE2eTestVirtualDom.getE2eTestVirtualDom(newState.content)
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
const renderPreviewTransform = {
  isEqual(oldState: E2eTestState, newState: E2eTestState) {
    return oldState.previewTransform === newState.previewTransform
  },
  apply(oldState: E2eTestState, newState: E2eTestState) {
    return ['setPreviewTransform', newState.previewTransform]
  },
}

export const render = [renderTests, renderIframe, renderPreviewTransform]
