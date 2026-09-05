import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as Id from '../src/parts/Id/Id.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn(async () => {}) }))
jest.unstable_mockModule('../src/parts/ViewletModule/ViewletModule.js', () => ({ load: jest.fn() }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ dispose: jest.fn(async (uid) => ViewletStates.remove(uid)) }))
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  load: jest.fn(async () => []),
  executeForApplication: jest.fn(async () => {}),
}))

const Application = await import('../src/parts/Application/Application.ts')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')

const options = (id: string) => ({
  id,
  rootId: `${id}-root`,
  width: 600,
  height: 800,
  href: '/samples',
  workspacePath: id,
  workspaceUri: `memfs:///${id}`,
})

beforeEach(() => {
  jest.clearAllMocks()
  Id.state.id = 0
  ViewletStates.reset()
})

afterEach(() => {
  ApplicationRegistry.remove('source')
  ApplicationRegistry.remove('preview')
  ViewletStates.reset()
})

test('mounts independently owned layouts into two separate host roots', async () => {
  const source = await Application.create(options('source'))
  const preview = await Application.create(options('preview'))
  expect(source).not.toBe(preview)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.executeCommands', [
    ['Viewlet.appendToRoot', source, 'source-root'],
    ['Viewlet.setBounds', source, 0, 0, 600, 800],
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.executeCommands', [
    ['Viewlet.appendToRoot', preview, 'preview-root'],
    ['Viewlet.setBounds', preview, 0, 0, 600, 800],
  ])
  expect(await Application.execute('source', 'Workspace.getUri')).toBe('memfs:///source')
  expect(await Application.execute('preview', 'Workspace.getPath')).toBe('preview')
  expect(await Application.execute('source', 'Layout.getHref')).toBe('/samples')
  await Application.executeForView(preview, 'Main.openInput', 'memfs:///README.md')
  expect(ViewletManager.executeForApplication).toHaveBeenCalledWith('preview', 'Main.openInput', 'memfs:///README.md')
  await Application.resize('source', 500, 700)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.setBounds', source, 0, 0, 500, 700)
})

test('failed mounting releases partial ownership and permits retrying the same application id', async () => {
  jest.mocked(RendererProcess.invoke).mockRejectedValueOnce(new Error('missing root'))
  await expect(Application.create(options('preview'))).rejects.toThrow('missing root')
  expect(() => ApplicationRegistry.get('preview')).toThrow('Application not found')
  expect(ApplicationRegistry.getOwner(1)).toBeUndefined()
  expect(await Application.create(options('preview'))).toBe(2)
})

test('concurrent disposal shares one teardown and preserves the sibling layout', async () => {
  const source = await Application.create(options('source'))
  const preview = await Application.create(options('preview'))
  const gate = Promise.withResolvers<void>()
  const started = Promise.withResolvers<void>()
  const pending = ApplicationRegistry.track('preview', async () => {
    started.resolve()
    await gate.promise
  })
  await started.promise
  const dispose = Application.dispose('preview')
  expect(Application.dispose('preview')).toBe(dispose)
  expect(() => Application.execute('preview', 'Main.openInput')).toThrow('Application is closing')
  gate.resolve()
  await pending
  await dispose
  expect(ApplicationRegistry.getOwner(source)).toBe('source')
  expect(ApplicationRegistry.getOwner(preview)).toBeUndefined()
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.dispose', preview)
  expect(RendererProcess.invoke).not.toHaveBeenCalledWith('Viewlet.dispose', source)
  await expect(Application.executeForView(preview, 'Main.openInput')).rejects.toThrow('Component not found')
})

test('a failed component teardown still releases application registrations', async () => {
  const uid = await Application.create(options('preview'))
  const state = { uid, applicationId: 'preview' }
  ViewletStates.set(uid, { state, renderedState: state, moduleId: 'Layout', factory: {} })
  jest.mocked(Viewlet.dispose).mockRejectedValueOnce(new Error('broken component'))
  await expect(Application.dispose('preview')).rejects.toThrow('Failed to dispose application')
  expect(ViewletStates.getByUid(uid)).toBeUndefined()
  expect(ApplicationRegistry.getOwner(uid)).toBeUndefined()
})

test('invalid dimensions never register an application', async () => {
  await expect(Application.create({ ...options('preview'), width: 0 })).rejects.toThrow('Invalid application root or dimensions')
  expect(() => ApplicationRegistry.get('preview')).toThrow('Application not found')
})
