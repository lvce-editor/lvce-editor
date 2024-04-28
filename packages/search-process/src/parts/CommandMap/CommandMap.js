import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as SearchFile from '../SearchFile/SearchFile.js'
import * as TextSearch from '../TextSearch/TextSearch.js'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'SearchFile.searchFile': SearchFile.searchFile,
  'TextSearch.search': TextSearch.search,
}
