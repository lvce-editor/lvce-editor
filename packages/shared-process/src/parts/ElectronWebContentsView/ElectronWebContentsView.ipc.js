import * as ElectronWebContentsView from './ElectronWebContentsView.js'

export const name = 'ElectronWebContentsView'

export const Commands = {
  createWebContentsView: ElectronWebContentsView.createWebContentsView,
  disposeWebContentsView: ElectronWebContentsView.disposeWebContentsView,
}
