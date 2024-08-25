import * as Transferrables from '../Transferrables/Transferrables.js'

export const isTransferrable = (value) => {
  for (const fn of Transferrables.transferrables) {
    if (fn(value)) {
      return true
    }
  }
  return false
}
