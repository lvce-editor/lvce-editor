import { expect, test } from '@jest/globals'
import * as Workers from '../src/parts/Workers/Workers.js'

test('cookie import view should let the main area own its tab title', () => {
  const worker = Workers.getWorkers().find(({ id }: Readonly<{ id: string }>) => id === 'cookieImportView')

  expect(worker).toBeDefined()
  expect(worker?.viewlet?.title).toBeUndefined()
})

test('workers view resize forwards its position and dimensions', () => {
  const worker = Workers.getWorkers().find(({ id }: Readonly<{ id: string }>) => id === 'workersView')

  expect(worker?.viewlet?.methods?.resize?.parameters).toEqual([
    { name: 'uid', source: 'state' },
    { index: 'x', name: 'dimensions', source: 'argument' },
    { index: 'y', name: 'dimensions', source: 'argument' },
    { index: 'width', name: 'dimensions', source: 'argument' },
    { index: 'height', name: 'dimensions', source: 'argument' },
  ])
})

test('cache worker is available in development and packaged builds', () => {
  const worker = Workers.getWorkers().find(({ id }: Readonly<{ id: string }>) => id === 'cacheWorker')

  expect(worker).toMatchObject({
    contentSecurityPolicy: ["default-src 'none'", 'sandbox allow-same-origin'],
    defaultPath: '/packages/renderer-worker/node_modules/@lvce-editor/cache-worker/cacheWorkerMain.js',
    fileName: 'cacheWorkerMain.js',
    productionPath: '/packages/cache-worker/cacheWorkerMain.js',
    settingName: 'develop.cacheWorkerPath',
  })
})

test('workers view keybindings are registered', () => {
  const worker = Workers.getWorkers().find(({ id }: Readonly<{ id: string }>) => id === 'workersView')

  expect(worker?.viewlet?.methods?.getKeyBindings).toEqual({
    name: 'Workers.getKeyBindings',
    parameters: [],
  })
})
