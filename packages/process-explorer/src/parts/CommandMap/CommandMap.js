import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as ProcessId from '../ProcessId/ProcessId.js'
import * as ListProcessesWithMemoryUsage from '../ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.js'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'ProcessId.getMainProcessId': ProcessId.getMainProcessId,
  'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage,
  // 'ElectronContextMenu.openContextMenu': ElectronWebContentsView.handleContextMenu,
}
