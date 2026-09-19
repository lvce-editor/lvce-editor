import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/PortsViewWorker/PortsViewWorker.ts', () => ({
  invoke: jest.fn(async (command) => {
    if (command === 'Ports.diff2' || command === 'Ports.render2') {
      return []
    }
    if (command === 'Ports.getCommandIds') {
      return ['addPort', 'removePort']
    }
    if (command === 'Ports.getComponentState') {
      return { uid: 1 }
    }
    return undefined
  }),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => 2),
}))

jest.unstable_mockModule('../src/parts/AssetDir/AssetDir.js', () => ({
  assetDir: '/test-assets',
}))

const PortsViewWorker = await import('../src/parts/PortsViewWorker/PortsViewWorker.ts')
const ViewletPorts = await import('../src/parts/ViewletPorts/ViewletPorts.ipc.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test('loads the ports view with platform, assets, and parent uid', async () => {
  expect(ViewletPorts.Css).toEqual(['/css/parts/ViewletPorts.css'])
  const state = ViewletPorts.create(1, 'ports://', 10, 20, 800, 600, {}, 99)

  await ViewletPorts.loadContent(state)

  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(1, 'Ports.create', 1, 'ports://', 10, 20, 800, 600, 2, '/test-assets', 99)
  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(2, 'Ports.loadContent', 1, '')
  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(3, 'Ports.diff2', 1)
  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(4, 'Ports.render2', 1, [])
})

test('registers ports view commands', async () => {
  await ViewletPorts.getCommands()

  expect(typeof ViewletPorts.Commands.addPort).toBe('function')
  expect(typeof ViewletPorts.Commands.removePort).toBe('function')
})

test('exposes component state commands', () => {
  expect(typeof ViewletPorts.getComponentState).toBe('function')
  expect(typeof ViewletPorts.setComponentState).toBe('function')
})

test('routes component state operations through the ports worker', async () => {
  const state = ViewletPorts.create(1, 'ports://', 10, 20, 800, 600)

  await expect(ViewletPorts.getComponentState(state)).resolves.toEqual({ uid: 1 })
  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(1, 'Ports.getComponentState', 1)

  await ViewletPorts.setComponentState(state, { uid: 1 })
  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(2, 'Ports.setComponentState', 1, { uid: 1 })
})

test('resizes and rerenders the ports view', async () => {
  const state = ViewletPorts.create(1, 'ports://', 10, 20, 800, 600)

  const result = await ViewletPorts.resize(state, { height: 400, width: 700 })

  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(1, 'Ports.resize', 1, { height: 400, width: 700 })
  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(2, 'Ports.diff2', 1)
  expect(PortsViewWorker.invoke).toHaveBeenNthCalledWith(3, 'Ports.render2', 1, [])
  expect(result).toEqual({ ...state, commands: [], height: 400, width: 700 })
})
