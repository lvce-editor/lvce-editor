import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.ts'

export const commandMap = {
  'ElectronWebContentsView.createWebContentsView': ElectronWebContentsView.createWebContentsView,
  'ElectronWebContentsView.disposeWebContentsView': ElectronWebContentsView.disposeWebContentsView,
  'ElectronWebContentsView.resizeWebContentsView': ElectronWebContentsView.resizeWebContentsView,
  'ElectronWebContentsView.setIframeSrc': ElectronWebContentsView.setIframeSrc,
}
