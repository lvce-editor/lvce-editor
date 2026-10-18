import { expect, test } from '@jest/globals'
import * as Workers from '../src/parts/Workers/Workers.js'

test('cookie import view should let the main area own its tab title', () => {
  const worker = Workers.getWorkers().find(({ id }: Readonly<{ id: string }>) => id === 'cookieImportView')

  expect(worker).toBeDefined()
  expect(worker?.viewlet?.title).toBeUndefined()
})

test('accounts view worker is available in development and packaged builds', () => {
  const worker = Workers.getWorkers().find(({ id }: Readonly<{ id: string }>) => id === 'accountsView')

  expect(worker).toMatchObject({
    defaultPath: '/packages/renderer-worker/node_modules/@lvce-editor/accounts-view/dist/accountsWorkerMain.js',
    fileName: 'accountsWorkerMain.js',
    productionPath: '/packages/accounts-view/dist/accountsWorkerMain.js',
    settingName: 'develop.accountsViewWorkerPath',
    viewlet: {
      capabilities: { directRender: true },
    },
  })
  expect(worker?.viewlet?.methods?.render).toEqual({
    name: 'Accounts.render2',
    parameters: [
      { name: 'uid', source: 'state' },
      { name: 'diff', source: 'result' },
    ],
  })
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

test('panel worker receives runtime configuration and application ownership', () => {
  const worker = Workers.getWorkers().find(({ id }: Readonly<{ id: string }>) => id === 'panel')

  expect(worker?.viewlet?.methods?.create?.parameters).toEqual([
    { name: 'uid', source: 'state' },
    { source: 'literal', value: '' },
    { name: 'x', source: 'state' },
    { name: 'y', source: 'state' },
    { name: 'width', source: 'state' },
    { name: 'height', source: 'state' },
    { name: 'platform', source: 'context' },
    { name: 'assetDir', source: 'context' },
    { name: 'applicationId', source: 'context' },
  ])
})

test('editor worker permits same-origin split modules while retaining its sandbox', () => {
  const worker = Workers.getWorkers().find(({ id }: Readonly<{ id: string }>) => id === 'editor')

  expect(worker?.contentSecurityPolicy).toEqual(["default-src 'none'", 'sandbox allow-same-origin', "script-src 'self'"])
})

test('all functional worker views provide direct event routing', () => {
  type Worker = Readonly<{
    id: string
    viewlet?: Readonly<{ capabilities?: Readonly<{ directRender?: boolean; rootRender?: boolean }> }>
  }>
  const functionalWorkers = Workers.getWorkers().filter((worker: Worker) => worker.viewlet?.capabilities?.rootRender)
  expect(functionalWorkers.length).toBeGreaterThan(30)
  const legacyWorkers = functionalWorkers.filter((worker: Worker) => !worker.viewlet?.capabilities?.directRender).map((worker: Worker) => worker.id)
  expect(legacyWorkers).toEqual(['iframeInspector'])
})
