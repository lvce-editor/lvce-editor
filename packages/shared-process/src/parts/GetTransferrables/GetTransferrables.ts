import * as WalkValue from '../WalkValue/WalkValue.ts'
import * as IsTransferrable from '../IsTransferrable/IsTransferrable.ts'

export const getTransferrables = (value: any): any => {
  const transferrables: any[] = []
  WalkValue.walkValue(value, transferrables, IsTransferrable.isTransferrable)
  return transferrables
}
