import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.js'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'ElectronWebContentsView.createWebContentsView': ElectronWebContentsView.createWebContentsView,
}
