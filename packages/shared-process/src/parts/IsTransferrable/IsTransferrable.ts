import * as Transferrables from '../Transferrables/Transferrables.ts'

export const isTransferrable = (value: any): any => {
  for (const fn of Transferrables.transferrables) {
    if (fn(value)) {
      return true
    }
  }
  return false
}
