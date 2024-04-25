import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.js'
import * as ElectronWebContents from '../ElectronWebContents/ElectronWebContents.js'

export const commandMap = {
  'ElectronWebContentsView.backward': ElectronWebContents.backward,
  'ElectronWebContentsView.createWebContentsView': ElectronWebContentsView.createWebContentsView,
  'ElectronWebContentsView.disposeWebContentsView': ElectronWebContentsView.disposeWebContentsView,
  'ElectronWebContentsView.focus': ElectronWebContents.focus,
  'ElectronWebContentsView.forward': ElectronWebContents.forward,
  'ElectronWebContentsView.getStats': ElectronWebContentsView.getStats,
  'ElectronWebContentsView.inspectElement': ElectronWebContents.inspectElement,
  'ElectronWebContentsView.openDevtools': ElectronWebContents.openDevtools,
  'ElectronWebContentsView.reload': ElectronWebContents.reload,
  'ElectronWebContentsView.resizeBrowserView': ElectronWebContentsView.resizeWebContentsView,
  'ElectronWebContentsView.setIframeSrc': ElectronWebContentsView.setIframeSrc,
  'ElectronWebContentsView.show': ElectronWebContentsView.show,
  'ElectronWebContents.handleDidNavigate': ElectronWebContentsView.handleDidNavigate,
  'ElectronWebContents.handleTitleUpdated': ElectronWebContentsView.handleTitleUpdated,
  'ElectronWebContents.handleBrowserViewDestroyed': ElectronWebContentsView.handleBrowserViewDestroyed,
  'ElectronWebContents.handleWillNavigate': ElectronWebContentsView.handleWillNavigate,
  'ElectronWebContents.handleContextMenu': ElectronWebContentsView.handleContextMenu,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
