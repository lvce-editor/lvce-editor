import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({ getPlatform: jest.fn(() => 2), platform: 2 }))
jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn() }))
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({ render: jest.fn() }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand: jest.fn() }))
jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => ({ getExtensionView: jest.fn() }))
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke: jest.fn() }))

const Platform = await import('../src/parts/Platform/Platform.js')
const ComponentState = await import('../src/parts/ComponentState/ComponentState.js')
const WorkerNames = await import('../src/parts/ComponentWorkerNames/ComponentWorkerNames.js')
const GetExtensionViews = await import('../src/parts/GetExtensionViews/GetExtensionViews.ts')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(Platform.getPlatform).mockReturnValue(2)
  ViewletStates.reset()
})

test('resolves worker ownership even when the displayed module name differs', async () => {
  const factory = { create: () => {}, hasFunctionalRender: true }
  WorkerNames.registerViewlet(factory.create, 'explorer')
  WorkerNames.registerWorker('/explorerViewWorkerMain.js', 'Explorer Worker')
  ViewletStates.set(9, { factory, renderedState: { uid: 9 }, moduleId: 'Renamed Explorer', state: { uid: 9 } })
  await expect(ComponentState.getWorkerName(9)).resolves.toBe('Explorer Worker')
  expect(ComponentState.getComponents()[0].heapSnapshotAvailable).toBe(true)
})

test('uses the current renderer worker for renderer-owned component state', async () => {
  Object.defineProperty(globalThis, 'name', { configurable: true, value: 'Renderer Worker (Electron)' })
  ViewletStates.set(9, { factory: {}, renderedState: { uid: 9 }, moduleId: 'Layout', state: { uid: 9 } })
  await expect(ComponentState.getWorkerName(9)).resolves.toBe('Renderer Worker (Electron)')
  Reflect.deleteProperty(globalThis, 'name')
})

test('rejects capture outside Electron and after component disposal', async () => {
  await expect(ComponentState.getWorkerName(9)).rejects.toThrow('Component not found: 9')
  jest.mocked(Platform.getPlatform).mockReturnValue(1)
  ViewletStates.set(9, { factory: {}, renderedState: { uid: 9 }, moduleId: 'Layout', state: { uid: 9 } })
  expect(ComponentState.getComponents()[0].heapSnapshotAvailable).toBe(false)
  await expect(ComponentState.getWorkerName(9)).rejects.toThrow('require Electron')
})

test('resolves an extension component to its isolated extension worker', async () => {
  ViewletStates.set(9, { factory: {}, renderedState: { uid: 9 }, moduleId: 'ExtensionView', state: { uid: 9, viewId: 'sample.view' } })
  jest.mocked(GetExtensionViews.getExtensionView).mockResolvedValue({ extensionId: 'sample.extension' } as any)
  jest.mocked(ExtensionManagementWorker.invoke).mockResolvedValue([{ id: 'sample.extension', isolated: true, workerName: 'Custom Extension' }])
  await expect(ComponentState.getWorkerName(9)).resolves.toBe('Custom Extension')
  jest.mocked(ExtensionManagementWorker.invoke).mockResolvedValue([{ id: 'sample.extension', isolated: true }])
  await expect(ComponentState.getWorkerName(9)).resolves.toBe('Extension API (Electron): sample.extension')
  jest.mocked(ExtensionManagementWorker.invoke).mockResolvedValue([{ id: 'sample.extension', isolated: false }])
  await expect(ComponentState.getWorkerName(9)).rejects.toThrow('does not have an isolated worker')
})
