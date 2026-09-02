import { expect, test } from '@jest/globals'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  bundleBuiltinSettings,
  deduplicateSettingsContributions,
  getSettingsContributionCandidates,
  normalizeSettingContribution,
} from '../src/parts/BundleBuiltinSettings/BundleBuiltinSettings.ts'

test.each([
  [0, 'none'],
  [1, 'enum'],
  [2, 'string'],
  [3, 'boolean'],
  [4, 'array'],
  [5, 'number'],
  [6, 'color'],
  [7, 'url'],
])('normalizes legacy setting type %s to %s', (type, expected) => {
  expect(normalizeSettingContribution({ id: 'test.setting', type })).toEqual({ id: 'test.setting', type: expected })
})

test('preserves unknown and readable setting types', () => {
  const readable = { id: 'test.setting', type: 'number' }
  expect(normalizeSettingContribution(readable)).toBe(readable)
  expect(normalizeSettingContribution({ id: 'test.setting', type: 99 })).toEqual({ id: 'test.setting', type: 99 })
})

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

test('bundles schema-complete renderer settings contributions', async () => {
  const toRoot = await mkdtemp(join(tmpdir(), 'lvce-builtin-settings-'))
  try {
    await bundleBuiltinSettings({
      toRoot,
      workers: [{ settingName: 'develop.editorWorkerPath' }],
    })

    const index = JSON.parse(await readFile(join(toRoot, 'builtin-settings', 'index.json'), 'utf8'))
    const settings = JSON.parse(await readFile(join(toRoot, 'builtin-settings', 'renderer-worker.json'), 'utf8'))
    const fileNames = await readdir(join(toRoot, 'builtin-settings'))
    expect(index).toEqual(['renderer-worker.json'])
    expect(fileNames).toEqual(['index.json', 'renderer-worker.json'])
    expect(settings).toEqual(
      expect.arrayContaining([
        {
          category: 'workbench',
          description: 'Controls the location of the side bar',
          heading: 'Side Bar Location',
          id: 'workbench.sideBarLocation',
          type: 'string',
          value: 'right',
        },
      ]),
    )
    expect(settings.every(({ category, description, heading, id, type }) => category && description && heading && id && type)).toBe(true)
  } finally {
    await rm(toRoot, { force: true, recursive: true })
  }
})

test('declares every default setting', async () => {
  const defaultSettingsUrl = new URL('../../../static/config/defaultSettings.json', import.meta.url)
  const workersUrl = new URL('../../renderer-worker/src/parts/Workers/Workers.json', import.meta.url)
  const defaultSettings = JSON.parse(await readFile(defaultSettingsUrl, 'utf8'))
  const workers = JSON.parse(await readFile(workersUrl, 'utf8'))
  const toRoot = await mkdtemp(join(tmpdir(), 'lvce-builtin-settings-'))
  try {
    await bundleBuiltinSettings({ toRoot, workers })
    const index = JSON.parse(await readFile(join(toRoot, 'builtin-settings', 'index.json'), 'utf8'))
    const settings = await Promise.all(index.map(async (fileName) => JSON.parse(await readFile(join(toRoot, 'builtin-settings', fileName), 'utf8'))))
    const declaredIds = new Set(settings.flat().map(({ id }) => id))

    expect(Object.keys(defaultSettings).filter((id) => !declaredIds.has(id))).toEqual([])
  } finally {
    await rm(toRoot, { force: true, recursive: true })
  }
})

test('deduplicates identical settings contributions', () => {
  const settingA = { category: 'chat', description: 'A setting', heading: 'A', id: 'chat.a', type: 3, value: true }
  const settingB = { category: 'chat', description: 'B setting', heading: 'B', id: 'chat.b', type: 3, value: false }

  expect(
    deduplicateSettingsContributions([
      { fileName: 'chat-view.json', settings: [settingA] },
      { fileName: 'chat-view-model.json', settings: [settingA, settingB] },
    ]),
  ).toEqual([
    { fileName: 'chat-view.json', settings: [{ ...settingA, type: 'boolean' }] },
    { fileName: 'chat-view-model.json', settings: [{ ...settingB, type: 'boolean' }] },
  ])
})

test('deduplicates equivalent numeric and readable setting types', () => {
  const legacySetting = { category: 'search', description: 'Threads', heading: 'Threads', id: 'search.threads', type: 5, value: 1 }
  const readableSetting = { ...legacySetting, type: 'number' }

  expect(
    deduplicateSettingsContributions([
      { fileName: 'renderer-worker.json', settings: [readableSetting] },
      { fileName: 'text-search-view.json', settings: [legacySetting] },
    ]),
  ).toEqual([{ fileName: 'renderer-worker.json', settings: [readableSetting] }])
})

test('rejects conflicting settings contributions', () => {
  expect(() =>
    deduplicateSettingsContributions([
      { fileName: 'first.json', settings: [{ id: 'chat.enabled', value: true }] },
      { fileName: 'second.json', settings: [{ id: 'chat.enabled', value: false }] },
    ]),
  ).toThrow('Conflicting builtin setting chat.enabled')
})
