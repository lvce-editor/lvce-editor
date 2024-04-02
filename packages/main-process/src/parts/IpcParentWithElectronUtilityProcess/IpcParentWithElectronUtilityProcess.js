import * as FormatUtilityProcessName from '../FormatUtilityProcessName/FormatUtilityProcessName.js'
import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'

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

export * from '@lvce-editor/ipc'
