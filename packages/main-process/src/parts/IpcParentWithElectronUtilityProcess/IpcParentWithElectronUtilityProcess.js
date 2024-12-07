import { IpcParentWithElectronUtilityProcess } from '@lvce-editor/ipc'
import * as FormatUtilityProcessName from '../FormatUtilityProcessName/FormatUtilityProcessName.js'
import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'

export const create = IpcParentWithElectronUtilityProcess.create

export const wrap = IpcParentWithElectronUtilityProcess.wrap

export const effects = ({ rawIpc, name }) => {
  if (!rawIpc.pid) {
    return
  }
  const pid = rawIpc.pid
  const formattedName = FormatUtilityProcessName.formatUtilityProcessName(name)
  UtilityProcessState.add(pid, rawIpc, formattedName)
  const cleanup = () => {
    UtilityProcessState.remove(pid)
    rawIpc.off('exit', handleExit)
  }
  const handleExit = () => {
    cleanup()
  }
  rawIpc.on('exit', handleExit)
}
