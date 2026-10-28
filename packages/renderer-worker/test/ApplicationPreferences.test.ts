import { afterEach, expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as GlobalEventBus from '../src/parts/GlobalEventBus/GlobalEventBus.js'
import * as NormalizeRendererCommands from '../src/parts/NormalizeRendererCommands/NormalizeRendererCommands.js'
import * as PreferencesState from '../src/parts/PreferencesState/PreferencesState.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

const addCssStyleSheet = jest.fn<(id: string, css: string) => Promise<void>>(async () => {})
jest.unstable_mockModule('../src/parts/Css/Css.js', () => ({ addCssStyleSheet }))
const rendererInvoke = jest.fn<(...args: readonly unknown[]) => Promise<void>>(async () => {})
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: rendererInvoke }))
const executeViewletCommand = jest.fn<(uid: number, command: string) => Promise<void>>(async () => {})
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand }))
const ApplicationPreferences = await import('../src/parts/ApplicationPreferences/ApplicationPreferences.ts')

const create = (id: string, layoutUid: number) => ApplicationRegistry.create({ id, layoutUid, href: '', workspaceUri: '', workspacePath: '' })

afterEach(async () => {
  await ApplicationRegistry.remove('source')
  await ApplicationRegistry.remove('preview')
  ViewletStates.reset()
  PreferencesState.setAll({})
  jest.clearAllMocks()
})

test('isolates overrides, falls back to global defaults and refreshes only owned editors', async () => {
  PreferencesState.set('editor.fontSize', 15)
  create('source', 1)
  create('preview', 2)
  ApplicationRegistry.own('source', 3)
  ApplicationRegistry.own('preview', 4)
  ViewletStates.set(3, { moduleId: ViewletModuleId.EditorText, factory: {}, renderedState: { uid: 3 }, state: { uid: 3 } })
  ViewletStates.set(4, { moduleId: ViewletModuleId.EditorText, factory: {}, renderedState: { uid: 4 }, state: { uid: 4 } })
  expect(ApplicationPreferences.get('preview', 'editor.fontSize')).toBe(15)
  await ApplicationPreferences.update('preview', { 'editor.fontSize': 18 })
  expect(ApplicationPreferences.get('preview', 'editor.fontSize')).toBe(18)
  expect(ApplicationPreferences.getAll('preview')['editor.fontSize']).toBe(18)
  expect(ApplicationPreferences.get('source', 'editor.fontSize')).toBe(15)
  expect(PreferencesState.get('editor.fontSize')).toBe(15)
  expect(addCssStyleSheet).toHaveBeenCalledWith('ApplicationPreferences-2', expect.stringContaining('#Workbench-2'))
  expect(addCssStyleSheet).toHaveBeenCalledWith('ApplicationPreferences-2', expect.stringContaining('--EditorFontSize: 18px'))
  expect(executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(executeViewletCommand).toHaveBeenCalledWith(4, 'handleSettingsChanged')
})

test('removes overrides with the application and rejects updates after closing', async () => {
  PreferencesState.set('editor.fontSize', 15)
  create('preview', 2)
  await ApplicationPreferences.update('preview', { 'editor.fontSize': 18 })
  ApplicationRegistry.close('preview')
  await expect(ApplicationPreferences.update('preview', { 'editor.fontSize': 20 })).rejects.toThrow('closing')
  NormalizeRendererCommands.setCssText('ApplicationPreferences-2', 'cached stylesheet')
  await ApplicationPreferences.dispose('preview')
  expect(NormalizeRendererCommands.getCssText('ApplicationPreferences-2')).toBeUndefined()
  expect(rendererInvoke).toHaveBeenCalledWith('Css.removeCssStyleSheet', 'ApplicationPreferences-2')
  await ApplicationRegistry.remove('preview')
  expect(() => ApplicationPreferences.get('preview', 'editor.fontSize')).toThrow('not found')
  create('preview', 2)
  expect(ApplicationPreferences.get('preview', 'editor.fontSize')).toBe(15)
})

test('global default changes refresh hosted editors while preserving explicit overrides', async () => {
  PreferencesState.set('editor.fontSize', 15)
  create('source', 1)
  create('preview', 2)
  await ApplicationPreferences.update('preview', { 'editor.fontSize': 18 })
  addCssStyleSheet.mockClear()
  PreferencesState.set('editor.fontSize', 16)
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(ApplicationPreferences.get('source', 'editor.fontSize')).toBe(16)
  expect(ApplicationPreferences.get('preview', 'editor.fontSize')).toBe(18)
  expect(addCssStyleSheet).toHaveBeenCalledWith('ApplicationPreferences-1', expect.stringContaining('--EditorFontSize: 16px'))
  expect(addCssStyleSheet).toHaveBeenCalledWith('ApplicationPreferences-2', expect.stringContaining('--EditorFontSize: 18px'))
})

test('global refresh tolerates an application disposed while another application refreshes', async () => {
  create('source', 1)
  create('preview', 2)
  addCssStyleSheet.mockImplementationOnce(async () => {
    ApplicationRegistry.close('preview')
    await ApplicationRegistry.remove('preview')
  })
  await expect(GlobalEventBus.emitEvent('preferences.changed')).resolves.toBeUndefined()
  expect(addCssStyleSheet.mock.calls.map(([id]) => id)).toEqual(['ApplicationPreferences-1'])
})

test('global refresh propagates errors from an application that is still open', async () => {
  create('source', 1)
  addCssStyleSheet.mockRejectedValueOnce(new Error('stylesheet failure'))
  await expect(GlobalEventBus.emitEvent('preferences.changed')).rejects.toThrow('stylesheet failure')
})

test('refreshes wheel speed for existing views while isolating application overrides', async () => {
  PreferencesState.set('application.scrollspeed', 1.5)
  create('source', 1)
  create('preview', 2)
  ApplicationRegistry.own('source', 3)
  ApplicationRegistry.own('preview', 4)
  ViewletStates.set(5, { moduleId: 'Search', factory: {}, renderedState: { uid: 5 }, state: { uid: 5 } })
  await ApplicationPreferences.update('preview', { 'application.scrollspeed': 10 })
  expect(rendererInvoke).toHaveBeenCalledWith('Viewlet.setScrollSpeed', 4, 10)
  rendererInvoke.mockClear()
  await GlobalEventBus.emitEvent('preferences.changed')
  expect(rendererInvoke).toHaveBeenCalledWith('Viewlet.setScrollSpeed', 3, 1.5)
  expect(rendererInvoke).toHaveBeenCalledWith('Viewlet.setScrollSpeed', 4, 10)
  expect(rendererInvoke).toHaveBeenCalledWith('Viewlet.setScrollSpeed', 5, 1.5)
  await ApplicationPreferences.update('preview', { 'application.scrollspeed': 10.1 })
  expect(rendererInvoke).toHaveBeenCalledWith('Viewlet.setScrollSpeed', 4, 1)
})
