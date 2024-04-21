import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.js'
import * as ElectronWebContents from '../ElectronWebContents/ElectronWebContents.js'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'ElectronWebContentsView.createWebContentsView': ElectronWebContentsView.createWebContentsView,
  'ElectronWebContentsView.resizeBrowserView': ElectronWebContentsView.resizeWebContentsView,
  'ElectronWebContentsView.setIframeSrc': ElectronWebContentsView.setIframeSrc,
  'ElectronWebContentsView.getStats': ElectronWebContentsView.getStats,
  'ElectronWebContentsView.show': ElectronWebContentsView.show,
  'ElectronWebContentsView.focus': ElectronWebContents.focus,
  'ElectronWebContentsView.openDevtools': ElectronWebContents.openDevtools,
  'ElectronWebContentsView.reload': ElectronWebContents.reload,
  'ElectronWebContentsView.forward': ElectronWebContents.forward,
  'ElectronWebContentsView.backward': ElectronWebContents.backward,
  'ElectronWebContentsView.inspectElement': ElectronWebContents.inspectElement,
}
