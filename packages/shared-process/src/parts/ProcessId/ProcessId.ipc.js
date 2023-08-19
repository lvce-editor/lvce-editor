import * as ProcessId from './ProcessId.js'

export const name = 'ProcessId'

export const Commands = {
  getMainProcessId: ProcessId.getMainProcessId,
  getSharedProcessId: ProcessId.getSharedProcessId,
}
