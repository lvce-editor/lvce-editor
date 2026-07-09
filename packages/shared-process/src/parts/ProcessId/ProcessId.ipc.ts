import * as ProcessId from './ProcessId.ts'

export const name = 'ProcessId'

export const Commands = {
  getMainProcessId: ProcessId.getMainProcessId,
  getSharedProcessId: ProcessId.getSharedProcessId,
}
