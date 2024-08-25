import * as GetTransferrables from '../GetTransferrables/GetTransferrables.js'
import * as RemoveValues from '../RemoveValues/RemoveValues.ts'

// workaround for electron not supporting transferrable objects
// as parameters. If the transferrable object is a parameter, in electron
// only an empty objected is received in the main process
export const fixElectronParameters = (value) => {
  const transfer = GetTransferrables.getTransferrables(value)
  const newValue = RemoveValues.removeValues(value, transfer)
  return {
    newValue,
    transfer,
  }
}
