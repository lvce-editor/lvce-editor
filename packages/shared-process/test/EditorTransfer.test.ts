import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const openNew = jest.fn<(url: string) => Promise<void>>()
const invoke = jest.fn<(...args: any[]) => Promise<void>>()
jest.unstable_mockModule('../src/parts/AppWindow/AppWindow.ts', () => ({ openNew }))
jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.ts', () => ({ invoke }))
const Transfer = await import('../src/parts/EditorTransfer/EditorTransfer.ts')

beforeEach(() => {
  jest.useFakeTimers()
  openNew.mockReset().mockResolvedValue()
  invoke.mockReset().mockResolvedValue()
})
afterEach(() => {
  jest.useRealTimers()
})

const getToken = (): string => new URL(openNew.mock.calls[0][0]).searchParams.get('editorTransfer')!
const payload = { editorInput: { type: 'process-explorer' }, workspaceUri: 'file:///workspace' }

test('waits for readiness, binds destination, and deletes the payload after success', async () => {
  let completed = false
  const opening = Transfer.openNewWithEditorInput(1, payload).then((id) => {
    completed = true
    return id
  })
  const token = getToken()
  expect(new URL(openNew.mock.calls[0][0]).searchParams.get('workspace')).toBe(payload.workspaceUri)
  expect(Transfer.takeEditorTransfer(2, token)).toBe(payload)
  expect(() => Transfer.takeEditorTransfer(3, token)).toThrow('no longer available')
  expect(() => Transfer.completeEditorTransfer(3, token)).toThrow('no longer available')
  await Promise.resolve()
  expect(completed).toBe(false)
  Transfer.completeEditorTransfer(2, token)
  expect(await opening).toBe(2)
  expect(() => Transfer.takeEditorTransfer(2, token)).toThrow('no longer available')
  expect(jest.getTimerCount()).toBe(0)
})

test('source cannot claim its own transfer', async () => {
  const opening = Transfer.openNewWithEditorInput(1, payload)
  const token = getToken()
  expect(() => Transfer.takeEditorTransfer(1, token)).toThrow('no longer available')
  Transfer.takeEditorTransfer(2, token)
  Transfer.completeEditorTransfer(2, token)
  await opening
})

test('initialization failure closes destination and rejects source', async () => {
  const opening = Transfer.openNewWithEditorInput(1, payload)
  const assertion = expect(opening).rejects.toThrow('cannot open input')
  const token = getToken()
  Transfer.takeEditorTransfer(2, token)
  Transfer.completeEditorTransfer(2, token, 'cannot open input')
  await assertion
  expect(invoke).toHaveBeenCalledWith('ElectronWindow.executeWindowFunction', 2, 'close')
  expect(() => Transfer.takeEditorTransfer(2, token)).toThrow('no longer available')
  expect(jest.getTimerCount()).toBe(0)
})

test('timeout removes payload and rejects late readiness', async () => {
  const opening = Transfer.openNewWithEditorInput(1, payload)
  const assertion = expect(opening).rejects.toThrow('Timed out')
  const token = getToken()
  Transfer.takeEditorTransfer(2, token)
  await jest.advanceTimersByTimeAsync(60_000)
  await assertion
  expect(invoke).toHaveBeenCalledWith('ElectronWindow.executeWindowFunction', 2, 'close')
  expect(() => Transfer.completeEditorTransfer(2, token)).toThrow('no longer available')
  expect(jest.getTimerCount()).toBe(0)
})

test('window creation failure removes unclaimed transfer', async () => {
  openNew.mockRejectedValue(new Error('load failed'))
  const opening = Transfer.openNewWithEditorInput(1, payload)
  const token = getToken()
  await expect(opening).rejects.toThrow('load failed')
  expect(() => Transfer.takeEditorTransfer(2, token)).toThrow('no longer available')
  expect(jest.getTimerCount()).toBe(0)
})

test('rejects missing input before creating window', async () => {
  await expect(Transfer.openNewWithEditorInput(1, {})).rejects.toThrow('Expected an editor input')
  expect(openNew).not.toHaveBeenCalled()
})
