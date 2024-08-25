import * as Transferrables from '../Transferrables/Transferrables.ts'

export const isTransferrable = (value: unknown): boolean => {
  for (const fn of Transferrables.transferrables) {
    if (value instanceof fn) {
      return true
    }
  }
  return false
}
