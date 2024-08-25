import * as WalkValue from '../WalkValue/WalkValue.js'
import * as IsTransferrable from '../IsTransferrable/IsTransferrable.js'

export const getTransferrables = (value) => {
  const transferrables = []
  WalkValue.walkValue(value, transferrables, IsTransferrable.isTransferrable)
  return transferrables
}
