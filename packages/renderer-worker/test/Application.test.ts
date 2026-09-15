import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as Id from '../src/parts/Id/Id.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn(async () => {}) }))
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke: jest.fn(async () => {}) }))
jest.unstable_mockModule('../src/parts/ViewletModule/ViewletModule.js', () => ({ load: jest.fn() }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  dispose: jest.fn(async (uid) => ViewletStates.remove(uid)),
  executeViewletCommand: jest.fn(async () => {}),
  openWidgetForApplication: jest.fn(async () => {}),
}))
jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostQuickPick.js', () => ({
  showQuickPick: jest.fn(async () => 'staging'),
  showQuickInput: jest.fn(async () => 'Ada'),
}))
jest.unstable_mockModule('../src/parts/QuickPick/QuickPick.js', () => ({ showCustom: jest.fn(async () => ({ inputValue: 'Ada' })) }))
jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  load: jest.fn(async () => []),
  executeForApplication: jest.fn(async () => {}),
}))

const Application = await import('../src/parts/Application/Application.ts')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')

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
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.dispose', uid)
})

test('invalid dimensions never register an application', async () => {
  await expect(Application.create({ ...options('preview'), width: 0 })).rejects.toThrow('Invalid application root or dimensions')
  expect(() => ApplicationRegistry.get('preview')).toThrow('Application not found')
})

test('saving an editor file notifies its host and extensions without re-entering the layout command', async () => {
  await Application.create(options('source'))
  jest.clearAllMocks()
  await Application.execute('source', 'FileSystem.writeFile', 'memfs:///main.ts', 'source', undefined, false)
  expect(ViewletManager.executeForApplication).not.toHaveBeenCalled()
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith('Extensions.invokeForApplication', 'source', 'Extensions.handleFileChanges', {
    changed: ['memfs:///main.ts'],
  })
  expect(RendererProcess.invoke).toHaveBeenCalledWith('ApplicationHost.fileSaved', 'source', 'memfs:///main.ts')
})

test('creating and copying source files refreshes only the source application', async () => {
  await Application.create(options('source'))
  await Application.create(options('preview'))
  jest.clearAllMocks()
  await Application.execute('source', 'FileSystem.createFile', 'memfs:///created.ts')
  await Application.execute('source', 'FileSystem.copy', 'memfs:///created.ts', 'memfs:///copied.ts')
  expect(ViewletManager.executeForApplication).toHaveBeenNthCalledWith(1, 'source', 'Layout.handleWorkspaceRefresh', {
    changed: ['memfs:///created.ts'],
  })
  expect(ViewletManager.executeForApplication).toHaveBeenNthCalledWith(2, 'source', 'Layout.handleWorkspaceRefresh', {
    changed: ['memfs:///copied.ts'],
  })
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith('ApplicationHost.fileSaved', 'source', 'memfs:///copied.ts')
  expect(await Application.execute('preview', 'FileSystem.exists', 'memfs:///copied.ts')).toBe(false)
})

test('text editor associations are scoped to the source application', async () => {
  await Application.create({ ...options('source'), textFileExtensions: ['.svg'] })
  await Application.create(options('preview'))
  jest.clearAllMocks()
  await Application.execute('source', 'Main.openUri', { uri: 'memfs:///icon.svg', focus: true, preview: true })
  expect(ViewletManager.executeForApplication).toHaveBeenCalledWith(
    'source',
    'Main.openInput',
    expect.objectContaining({ editorInput: { type: 'editor', uri: 'memfs:///icon.svg', forceText: true }, focus: true, preview: true }),
  )
  await Application.execute('preview', 'Main.openUri', 'memfs:///icon.svg')
  expect(ViewletManager.executeForApplication).toHaveBeenLastCalledWith('preview', 'Main.openUri', 'memfs:///icon.svg')
  await Application.execute('source', 'Main.openInput', { editorInput: { type: 'editor', uri: 'memfs:///icon.svg' }, focus: true })
  expect(ViewletManager.executeForApplication).toHaveBeenLastCalledWith('source', 'Main.openInput', {
    editorInput: { type: 'editor', uri: 'memfs:///icon.svg', forceText: true },
    focus: true,
  })
})

test('extension commands execute in the owning application', async () => {
  await Application.create(options('source'))
  await Application.create(options('preview'))
  jest.clearAllMocks()
  await Application.execute('source', 'ExtensionHost.executeCommand', 'eslint.showPerformanceTrace')
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith(
    'Extensions.invokeForApplication',
    'source',
    'Extensions.executeCommand',
    'eslint.showPerformanceTrace',
  )
  expect(ViewletManager.executeForApplication).not.toHaveBeenCalled()
})

test('extension reload refreshes existing application views without disposing the layout', async () => {
  const source = await Application.create(options('source'))
  const preview = await Application.create(options('preview'))
  const replacement = { id: 'sample', browser: 'blob:new' }
  const uri = 'sample-memfs:///README.md'
  ApplicationRegistry.own('preview', 100)
  ViewletStates.set(100, { moduleId: 'Editor', factory: {}, state: { uid: 100, uri, applicationId: 'preview' }, renderedState: { uid: 100 } })
  ApplicationRegistry.own('preview', 101)
  ViewletStates.set(101, { moduleId: 'ExtensionView', factory: {}, state: { uid: 101, applicationId: 'preview' }, renderedState: { uid: 101 } })
  await Application.execute('preview', 'Extensions.reload', 'sample', replacement)
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith('Extensions.reloadApplicationExtension', 'preview', 'sample', replacement)
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(100, 'loadContent', undefined, { preserveFocus: true })
  expect(Viewlet.executeViewletCommand).toHaveBeenCalledWith(101, 'loadContent', undefined, { preserveFocus: true })
  expect(ViewletManager.executeForApplication).toHaveBeenCalledWith('preview', 'Layout.handleWorkspaceRefresh')
  expect(Viewlet.dispose).not.toHaveBeenCalled()
  expect(ApplicationRegistry.getOwner(source)).toBe('source')
  expect(ApplicationRegistry.getOwner(preview)).toBe('preview')
  expect(ApplicationRegistry.getOwner(100)).toBe('preview')
})

test('a failed extension replacement leaves application views mounted and does not refresh them', async () => {
  await Application.create(options('preview'))
  jest.mocked(ExtensionManagementWorker.invoke).mockRejectedValueOnce(new Error('reload failed'))
  jest.mocked(ViewletManager.executeForApplication).mockClear()
  await expect(Application.execute('preview', 'Extensions.reload', 'sample', {})).rejects.toThrow('reload failed')
  expect(ViewletManager.executeForApplication).not.toHaveBeenCalled()
  expect(Viewlet.dispose).not.toHaveBeenCalled()
})

test('loads workspace ports before the initial panel is registered', async () => {
  const ports = [{ port: 3000, forwardedAddress: 'https://test-3000.app.github.dev/' }]
  jest.mocked(ExtensionManagementWorker.invoke).mockResolvedValueOnce([ports])
  expect(await Application.executeForView(12345, 'PortProvider.getPorts', 'codespaces://test/app')).toEqual(ports)
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith(
    'Extensions.executeProvidersByEvent',
    'onPorts:codespaces',
    'ExtensionApi.providePorts',
    'codespaces://test/app',
  )
})

test('routes extension prompts and their widgets to the explicit application', async () => {
  const ExtensionHostQuickPick = await import('../src/parts/ExtensionHost/ExtensionHostQuickPick.js')
  const QuickPick = await import('../src/parts/QuickPick/QuickPick.js')
  await Application.create(options('source'))
  await Application.create(options('preview'))
  const picks = { items: [] }
  await expect(Application.execute('preview', 'ExtensionHostQuickPick.showQuickPick', picks)).resolves.toBe('staging')
  expect(ExtensionHostQuickPick.showQuickPick).toHaveBeenCalledWith(picks, 'preview')
  await expect(Application.execute('source', 'ExtensionHostQuickPick.showQuickInput', {})).resolves.toBe('Ada')
  expect(ExtensionHostQuickPick.showQuickInput).toHaveBeenCalledWith({}, 'source')
  await Application.execute('preview', 'Viewlet.openWidget', 'QuickPick', 'custom', [], 5, {})
  expect(Viewlet.openWidgetForApplication).toHaveBeenCalledWith('preview', 'QuickPick', 'custom', [], 5, {})
  await Application.execute('source', 'QuickPick.showCustom', [], { placeholder: 'Name' })
  expect(QuickPick.showCustom).toHaveBeenCalledWith([], { placeholder: 'Name' }, 'source')
})

test('notification creation targets the originating layout', async () => {
  const source = await Application.create(options('source'))
  const preview = await Application.create(options('preview'))
  jest.clearAllMocks()
  await Application.execute('preview', 'Notification.create', 'info', 'Hello World!')
  await Application.execute('source', 'Notification.create', 'warning', 'Source warning')
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, 'Notification.create', 'info', 'Hello World!', preview)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Notification.create', 'warning', 'Source warning', source)
  expect(ViewletManager.executeForApplication).not.toHaveBeenCalled()
})

test('dialog entry points create a widget in the calling application before an instance exists', async () => {
  await Application.create(options('source'))
  await Application.create(options('preview'))
  jest.clearAllMocks()
  const warning = { title: 'Warning', message: 'Continue?', type: 'info' }
  await Application.execute('preview', 'Dialog.showWarning', warning)
  await Application.execute('source', 'Dialog.show', { message: 'Source dialog', type: 'info' })
  expect(Viewlet.openWidgetForApplication).toHaveBeenNthCalledWith(1, 'preview', 'Dialog', { ...warning, type: 'warning' })
  expect(Viewlet.openWidgetForApplication).toHaveBeenNthCalledWith(2, 'source', 'Dialog', { message: 'Source dialog', type: 'info' })
  expect(ViewletManager.executeForApplication).not.toHaveBeenCalled()
})
