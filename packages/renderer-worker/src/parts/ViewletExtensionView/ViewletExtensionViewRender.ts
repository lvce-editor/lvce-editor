import type { ViewletExtensionViewState } from './ViewletExtensionViewState.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderIframe = {
  isEqual(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): boolean {
    return (
      oldState.iframeSrc === newState.iframeSrc &&
      oldState.iframeSandbox === newState.iframeSandbox &&
      oldState.csp === newState.csp &&
      oldState.credentialless === newState.credentialless
    )
  },
  apply(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): readonly unknown[] {
    return ['setIframe', newState.iframeSrc, newState.iframeSandbox, '', newState.csp, newState.credentialless, newState.title]
  },
}

export const render = [renderIframe]
