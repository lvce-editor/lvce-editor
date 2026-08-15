import * as IsTransferrable from '../IsTransferrable/IsTransferrable.ts'

const walkValue = (value: unknown, transferrables: Transferable[], seen: WeakSet<object>): void => {
  if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
    return
  }
  if (seen.has(value)) {
    return
  }
  seen.add(value)
  if (value instanceof ArrayBuffer || IsTransferrable.isTransferrable(value)) {
    transferrables.push(value as Transferable)
    return
  }
  if (ArrayBuffer.isView(value)) {
    walkValue(value.buffer, transferrables, seen)
    return
  }
  for (const child of Array.isArray(value) ? value : Object.values(value)) {
    walkValue(child, transferrables, seen)
  }
}

export const getIpcTraceTransferrables = (value: unknown): Transferable[] => {
  const transferrables: Transferable[] = []
  walkValue(value, transferrables, new WeakSet())
  return transferrables
}
