import { expect, test } from '@jest/globals'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  bundleBuiltinSettings,
  createSettingsContribution,
  createWorkerPathSettingsContribution,
  getSettingsContributionCandidates,
} from '../src/parts/BundleBuiltinSettings/BundleBuiltinSettings.ts'

test('gets one settings contribution candidate per worker package', () => {
  const workers = [
    {
      defaultPath: '/packages/renderer-worker/node_modules/@lvce-editor/editor-worker/dist/editorWorkerMain.js',
      productionPath: '/packages/editor-worker/dist/editorWorkerMain.js',
    },
    {
      defaultPath: '/packages/renderer-worker/node_modules/@lvce-editor/editor-worker/dist/editorWorkerHelperMain.js',
      productionPath: '/packages/editor-worker/dist/editorWorkerHelperMain.js',
    },
    {
      defaultPath: '\\packages\\renderer-worker\\node_modules\\@lvce-editor\\explorer-view\\dist\\explorerViewWorkerMain.js',
      productionPath: '\\packages\\explorer-view\\dist\\explorerViewWorkerMain.js',
    },
  ]

  expect(getSettingsContributionCandidates(workers)).toEqual([
    {
      packageName: 'editor-worker',
      sourcePath: 'packages/renderer-worker/node_modules/@lvce-editor/editor-worker/dist/settings.json',
    },
    {
      packageName: 'explorer-view',
      sourcePath: 'packages/renderer-worker/node_modules/@lvce-editor/explorer-view/dist/settings.json',
    },
  ])
})

test('creates settings contributions with the correct types', () => {
  expect(
    createSettingsContribution({
      array: ['value'],
      boolean: true,
      number: 1,
      object: { key: true },
      string: 'value',
    }),
  ).toEqual([
    { id: 'array', type: 4, value: ['value'] },
    { id: 'boolean', type: 3, value: true },
    { id: 'number', type: 5, value: 1 },
    { id: 'object', type: 4, value: { key: true } },
    { id: 'string', type: 2, value: 'value' },
  ])
})

test('creates one setting for each configurable worker path', () => {
  expect(
    createWorkerPathSettingsContribution([
      { settingName: 'develop.editorWorkerPath' },
      { settingName: 'develop.editorWorkerPath' },
      { settingName: 'develop.explorerWorkerPath' },
      {},
    ]),
  ).toEqual([
    { id: 'develop.editorWorkerPath', type: 2, value: '' },
    { id: 'develop.explorerWorkerPath', type: 2, value: '' },
  ])
})

test('creates a contribution for every default setting', async () => {
  const defaultSettingsUrl = new URL('../../../static/config/defaultSettings.json', import.meta.url)
  const defaultSettings = JSON.parse(await readFile(defaultSettingsUrl, 'utf8'))
  const contribution = createSettingsContribution(defaultSettings)

  expect(Object.fromEntries(contribution.map(({ id, value }) => [id, value]))).toEqual(defaultSettings)
  expect(new Set(contribution.map(({ id }) => id)).size).toBe(contribution.length)
})

test('bundles core and worker path settings', async () => {
  const toRoot = await mkdtemp(join(tmpdir(), 'lvce-builtin-settings-'))
  try {
    await bundleBuiltinSettings({
      toRoot,
      workers: [{ settingName: 'develop.editorWorkerPath' }],
    })

    const index = JSON.parse(await readFile(join(toRoot, 'builtin-settings', 'index.json'), 'utf8'))
    const settings = JSON.parse(await readFile(join(toRoot, 'builtin-settings', 'renderer-worker.json'), 'utf8'))
    expect(index).toEqual(['renderer-worker.json'])
    expect(settings).toEqual(
      expect.arrayContaining([
        { id: 'develop.editorWorkerPath', type: 2, value: '' },
        { id: 'editor.formatOnSave', type: 3, value: false },
        { id: 'workbench.sideBarLocation', type: 2, value: 'right' },
      ]),
    )
  } finally {
    await rm(toRoot, { force: true, recursive: true })
  }
})

test('covers every literal renderer preference', async () => {
  const defaultSettingsUrl = new URL('../../../static/config/defaultSettings.json', import.meta.url)
  const workersUrl = new URL('../../renderer-worker/src/parts/Workers/Workers.json', import.meta.url)
  const rendererSourceUrl = new URL('../../renderer-worker/src/', import.meta.url)
  const defaultSettings = JSON.parse(await readFile(defaultSettingsUrl, 'utf8'))
  const workers = JSON.parse(await readFile(workersUrl, 'utf8'))
  const knownSettings = new Set([...Object.keys(defaultSettings), ...createWorkerPathSettingsContribution(workers).map(({ id }) => id)])
  const usedSettings = new Set<string>()
  const fileNames = await readdir(rendererSourceUrl, { recursive: true })
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.js') && !fileName.endsWith('.ts')) {
      continue
    }
    const source = await readFile(new URL(fileName, rendererSourceUrl), 'utf8')
    for (const match of source.matchAll(/Preferences\.get\(['"]([^'"]+)/g)) {
      usedSettings.add(match[1])
    }
  }

  expect([...usedSettings].filter((id) => !knownSettings.has(id)).toSorted((a, b) => a.localeCompare(b))).toEqual([])
})
