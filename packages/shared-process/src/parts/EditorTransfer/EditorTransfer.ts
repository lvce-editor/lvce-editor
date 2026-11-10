import { randomUUID } from 'node:crypto'
import * as AppWindow from '../AppWindow/AppWindow.ts'
import * as DefaultUrl from '../DefaultUrl/DefaultUrl.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

interface Transfer {
  destinationWindowId?: number
  readonly payload: any
  readonly reject: (error: Error) => void
  readonly resolve: () => void
  readonly sourceWindowId: number
}

const transfers = new Map<string, Transfer>()

export const openNewWithEditorInput = async (sourceWindowId: number, payload: any): Promise<number | undefined> => {
  if (!payload?.editorInput || typeof payload.editorInput.type !== 'string') {
    throw new TypeError('Expected an editor input')
  }
  const token = randomUUID()
  let timer: ReturnType<typeof setTimeout> | undefined
  let transfer: Transfer
  const ready = new Promise<void>((resolve, reject) => {
    transfer = { payload, reject, resolve, sourceWindowId }
    transfers.set(token, transfer)
    timer = setTimeout(() => reject(new Error('Timed out opening the detached editor')), 60_000)
  })
  const url = new URL(DefaultUrl.defaultUrl)
  url.searchParams.set('editorTransfer', token)
  if (payload.workspaceUri) url.searchParams.set('workspace', payload.workspaceUri)
  try {
    await Promise.all([AppWindow.openNew(url.toString()), ready])
    return transfer!.destinationWindowId
  } catch (error) {
    // Keep the source tab and dispose the failed destination if it connected.
    if (transfer!.destinationWindowId !== undefined) {
      await ParentIpc.invoke('ElectronWindow.executeWindowFunction', transfer!.destinationWindowId, 'close')
    }
    throw error
  } finally {
    clearTimeout(timer)
    transfers.delete(token)
  }
}

export const takeEditorTransfer = (windowId: number, token: string): any => {
  const transfer = transfers.get(token)
  if (!transfer || windowId === transfer.sourceWindowId || transfer.destinationWindowId !== undefined) {
    throw new Error('Editor transfer is no longer available')
  }
  transfer.destinationWindowId = windowId
  return transfer.payload
}

export const completeEditorTransfer = (windowId: number, token: string, errorMessage?: string): void => {
  const transfer = transfers.get(token)
  if (!transfer || transfer.destinationWindowId !== windowId) {
    throw new Error('Editor transfer is no longer available')
  }
  if (errorMessage) {
    transfer.reject(new Error(errorMessage))
  } else {
    transfer.resolve()
  }
}
