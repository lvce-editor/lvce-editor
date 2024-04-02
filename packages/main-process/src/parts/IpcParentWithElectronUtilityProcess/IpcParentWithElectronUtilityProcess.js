import * as FormatUtilityProcessName from '../FormatUtilityProcessName/FormatUtilityProcessName.js'
import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'
import { IpcParentWithElectronUtilityProcess } from '@lvce-editor/ipc'

export const create = IpcParentWithElectronUtilityProcess.create

export const wrap = IpcParentWithElectronUtilityProcess.wrap

export const effects = ({ rawIpc, name }) => {
  if (!rawIpc.pid) {
    return
  }
  const formattedName = FormatUtilityProcessName.formatUtilityProcessName(name)
  UtilityProcessState.add(rawIpc.pid, rawIpc, formattedName)
  const cleanup = () => {
    UtilityProcessState.remove(rawIpc.pid)
    rawIpc.off('exit', handleExit)
  }
  const handleExit = () => {
    cleanup()
  }
  rawIpc.on('exit', handleExit)
}
