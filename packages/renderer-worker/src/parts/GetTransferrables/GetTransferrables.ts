import * as WalkValue from '../WalkValue/WalkValue.ts'
import * as IsTransferrable from '../IsTransferrable/IsTransferrable.ts'

export const getTransferrables = (value: unknown): any => {
  const transferrables: Transferable[] = []
  WalkValue.walkValue(value, transferrables, IsTransferrable.isTransferrable)
  return transferrables
}
