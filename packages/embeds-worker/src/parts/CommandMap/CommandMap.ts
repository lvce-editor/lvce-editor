import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.ts'

export const commandMap = {
  'ElectronWebContentsView.createWebContentsView': ElectronWebContentsView.createWebContentsView,
  'ElectronWebContentsView.disposeWebContentsView': ElectronWebContentsView.disposeWebContentsView,
}
