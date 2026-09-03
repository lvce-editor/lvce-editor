import { expect, test } from '@jest/globals'
import * as ViewletModuleMap from '../src/parts/ViewletModuleMap/ViewletModuleMap.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

test('diff editor uses worker-backed module', async () => {
  const module = await ViewletModuleMap.map[ViewletModuleId.DiffEditor]()

  // expect(module.name).toBe('DiffEditor')
  expect(module.hasFunctionalRender).toBe(true)
  expect(typeof module.loadContent).toBe('function')
  expect(typeof module.saveState).toBe('function')
  // expect(typeof module.Commands.setDeltaY).toBe('function')
  // expect(typeof module.Commands.handleWheel).toBe('function')
})

test('process explorer uses worker-backed module', async () => {
  const module = await ViewletModuleMap.map[ViewletModuleId.ProcessExplorer]()

  expect(module.hasFunctionalRender).toBe(true)
  expect(typeof module.loadContent).toBe('function')
  expect(typeof module.getCommands).toBe('function')
  expect(typeof module.getKeyBindings).toBe('function')
})

test('file watcher explorer uses worker-backed module', async () => {
  const module = await ViewletModuleMap.map[ViewletModuleId.FileWatcherExplorer]()

  expect(module.hasFunctionalRender).toBe(true)
  expect(typeof module.loadContent).toBe('function')
  expect(typeof module.getCommands).toBe('function')
  expect(typeof module.getKeyBindings).toBe('function')
})

test('running extensions uses worker-backed module', async () => {
  const module = await ViewletModuleMap.map[ViewletModuleId.RunningExtensions]()

  expect(module.hasFunctionalRender).toBe(true)
  expect(typeof module.loadContent).toBe('function')
  expect(typeof module.getCommands).toBe('function')
})

test('simple browser history exposes the placeholder view', async () => {
  const module = await ViewletModuleMap.map[ViewletModuleId.SimpleBrowserHistory]()

  expect(module.hasFunctionalRender).toBe(true)
  expect(module.hasFunctionalRootRender).toBe(true)
  expect(typeof module.create).toBe('function')
  expect(typeof module.loadContent).toBe('function')
  expect(typeof module.Commands.handleInput).toBe('function')
  expect(typeof module.Commands.clearHistory).toBe('function')
})

const genericWorkerViewlets = [
  ViewletModuleId.About,
  ViewletModuleId.ActivityBar,
  ViewletModuleId.Chat,
  ViewletModuleId.ChatDebug,
  ViewletModuleId.Dialog,
  ViewletModuleId.DiffEditor,
  ViewletModuleId.Explorer,
  ViewletModuleId.ExtensionDetail,
  ViewletModuleId.Extensions,
  ViewletModuleId.IframeInspector,
  ViewletModuleId.KeyBindings,
  ViewletModuleId.LanguageModels,
  ViewletModuleId.Main,
  ViewletModuleId.NotificationCenter,
  ViewletModuleId.Output,
  ViewletModuleId.Panel,
  ViewletModuleId.Ports,
  ViewletModuleId.Preview,
  ViewletModuleId.Problems,
  ViewletModuleId.ProcessExplorer,
  ViewletModuleId.FileWatcherExplorer,
  ViewletModuleId.QuickPick,
  ViewletModuleId.RunningExtensions,
  ViewletModuleId.Search,
  ViewletModuleId.Settings,
  ViewletModuleId.StatusBar,
  ViewletModuleId.TitleBar,
]

test.each(genericWorkerViewlets)('generic worker viewlet %s exposes the common interface', async (moduleId) => {
  const module = await ViewletModuleMap.map[moduleId]()

  expect(typeof module.name).toBe('string')
  expect(typeof module.create).toBe('function')
  expect(typeof module.loadContent).toBe('function')
  expect(module.hasFunctionalRender).toBe(true)
  expect(Array.isArray(module.render)).toBe(true)
})
