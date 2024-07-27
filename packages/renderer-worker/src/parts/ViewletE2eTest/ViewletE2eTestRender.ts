import type { E2eTestState } from './ViewletE2eTestTypes.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

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

export const render = [renderIframe, renderPreviewTransform]
