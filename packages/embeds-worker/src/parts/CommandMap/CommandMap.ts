import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.ts'

export const commandMap = {
  'ElectronWebContentsView.backward': ElectronWebContentsView.backward,
  'ElectronWebContentsView.cancelNavigation': ElectronWebContentsView.cancelNavigation,
  'ElectronWebContentsView.copyImageAt': ElectronWebContentsView.copyImageAt,
  'ElectronWebContentsView.createWebContentsView': ElectronWebContentsView.createWebContentsView,
  'ElectronWebContentsView.disposeWebContentsView': ElectronWebContentsView.disposeWebContentsView,
  'ElectronWebContentsView.focus': ElectronWebContentsView.focus,
  'ElectronWebContentsView.forward': ElectronWebContentsView.forward,
  'ElectronWebContentsView.getStats': ElectronWebContentsView.getStats,
  'ElectronWebContentsView.handleDidNavigate': ElectronWebContentsView.handleDidNavigate,
  'ElectronWebContentsView.handleTitleUpdated': ElectronWebContentsView.handleTitleUpdated,
  'ElectronWebContentsView.hide': ElectronWebContentsView.hide,
  'ElectronWebContentsView.inspectElement': ElectronWebContentsView.inspectElement,
  'ElectronWebContentsView.openDevtools': ElectronWebContentsView.openDevtools,
  'ElectronWebContentsView.reload': ElectronWebContentsView.reload,
  'ElectronWebContentsView.resizeWebContentsView': ElectronWebContentsView.resizeWebContentsView,
  'ElectronWebContentsView.setFallthroughKeyBindings': ElectronWebContentsView.setFallthroughKeyBindings,
  'ElectronWebContentsView.setIframeSrc': ElectronWebContentsView.setIframeSrc,
  'ElectronWebContentsView.show': ElectronWebContentsView.show,
  'ElectronWebContentsView.handleWillNavigate': ElectronWebContentsView.handleWillNavigate,
}
