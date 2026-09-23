import { beforeEach, expect, jest, test } from '@jest/globals'

const instances = new Map<number, any>()
const invoke = jest.fn<any>()
const render = jest.fn<any>()
const dispose = jest.fn<any>()
const resize = jest.fn<any>()
const execute = jest.fn<any>()
const send = jest.fn<any>()
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getInstance: (uid) => instances.get(uid) }))
jest.unstable_mockModule('../src/parts/ApplicationRegistry/ApplicationRegistry.ts', () => ({ getOwner: () => 'app-1' }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ dispose, resize, executeViewletCommand: execute }))
jest.unstable_mockModule('../src/parts/MainAreaWorker/MainAreaWorker.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/RenderMainAreaPending/RenderMainAreaPending.ts', () => ({ renderMainAreaPending: render }))
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: send }))
const Transfer = await import('../src/parts/TerminalTransfer/TerminalTransfer.js')

beforeEach(() => {
  jest.resetAllMocks()
  Transfer.forget(300)
  instances.clear()
  instances.set(100, { moduleId: 'Main', state: { uid: 100 } })
  instances.set(200, {
    moduleId: 'Terminals',
    state: { uid: 200, tabs: [{ uid: 300, terminalUids: [300, 301], label: 'bash', icon: 'terminal-bash' }] },
  })
  instances.set(300, { moduleId: 'Terminal2', state: { uid: 300, disposed: false } })
  resize.mockResolvedValue([])
})

test('round trip preserves the same live terminal and rejects duplicate ownership claims', async () => {
  expect(await Transfer.takePanelTerminal(100, 200, 300)).toMatchObject({ uid: 300, label: 'bash' })
  expect(await Transfer.takePanelTerminal(100, 200, 300)).toBeUndefined()
  Transfer.commit(300, 100)
  expect(await Transfer.takePanelTerminal(100, 200, 300)).toBeUndefined()
  expect(Transfer.beginPanelTransfer(100, 200, 300)).toBe(true)
  await Transfer.attachPanelTerminal(100, 200, 300, 'bash', 'terminal-bash')
  expect(execute.mock.calls).toEqual([
    [200, 'detachTerminal', 300],
    [200, 'attachTerminal', { uid: 300, label: 'bash', icon: 'terminal-bash' }],
  ])
  expect(dispose).not.toHaveBeenCalled()
})

test('rollback restores the split position without disposing the session', async () => {
  await Transfer.takePanelTerminal(100, 200, 300)
  await Transfer.rollback(300)
  expect(execute).toHaveBeenLastCalledWith(200, 'attachTerminal', { uid: 300, groupUid: 300, label: 'bash', icon: 'terminal-bash' }, 0, 0)
  expect(dispose).not.toHaveBeenCalled()
})

test('exit while moving to main rejects the commit and disposes without resurrecting the tab', async () => {
  await Transfer.takePanelTerminal(100, 200, 300)
  expect(await Transfer.handleExit(300)).toBe(true)
  expect(() => Transfer.commit(300, 100)).toThrow('Terminal exited during transfer')
  await Transfer.rollback(300)
  expect(dispose).toHaveBeenCalledWith(300)
  expect(execute).toHaveBeenCalledTimes(1)
})

test('exit while moving back removes the new panel entry before releasing the main tab', async () => {
  await Transfer.takePanelTerminal(100, 200, 300)
  Transfer.commit(300, 100)
  execute.mockImplementationOnce(async () => {
    await Transfer.handleExit(300)
  })
  expect(Transfer.beginPanelTransfer(100, 200, 300)).toBe(true)
  await Transfer.attachPanelTerminal(100, 200, 300, 'bash', 'terminal-bash')
  expect(execute).toHaveBeenLastCalledWith(200, 'handleTerminalExit', 300)
  expect(invoke).not.toHaveBeenCalled()
})

test('failed panel attachment retains main ownership and removes any partial panel entry', async () => {
  await Transfer.takePanelTerminal(100, 200, 300)
  Transfer.commit(300, 100)
  Transfer.beginPanelTransfer(100, 200, 300)
  execute.mockRejectedValueOnce(new Error('render failed'))
  await expect(Transfer.attachPanelTerminal(100, 200, 300, 'bash', 'terminal-bash')).rejects.toThrow('render failed')
  expect(execute).toHaveBeenLastCalledWith(200, 'detachTerminal', 300)
  await Transfer.cancelPanelTransfer(300)
  await Transfer.handleExit(300)
  expect(invoke).toHaveBeenCalledWith('MainArea.handleTerminalExit', 100, 300)
  expect(dispose).toHaveBeenCalledWith(300)
})

test('closed terminals and invalid sources do not transfer', async () => {
  expect(await Transfer.takePanelTerminal(100, 999, 300)).toBeUndefined()
  expect(await Transfer.takePanelTerminal(100, 200, 999)).toBeUndefined()
  expect(Transfer.beginPanelTransfer(100, 200, 300)).toBe(false)
  expect(await Transfer.handleExit(300)).toBe(false)
  expect(execute).not.toHaveBeenCalled()
})

test('resizes the existing terminal rather than creating another', async () => {
  const bounds = { x: 0, y: 0, width: 800, height: 500 }
  resize.mockResolvedValue([['Viewlet.setBounds', 300, bounds]])
  await Transfer.resize(300, bounds)
  expect(resize).toHaveBeenCalledWith(300, bounds)
  expect(send).toHaveBeenCalledWith('Viewlet.sendMultiple', [['Viewlet.setBounds', 300, bounds]])
})
