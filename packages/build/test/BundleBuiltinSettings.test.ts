import { expect, test } from '@jest/globals'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  bundleBuiltinSettings,
  deduplicateSettingsContributions,
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

test('does not expose renderer worker defaults as settings contributions', async () => {
  const toRoot = await mkdtemp(join(tmpdir(), 'lvce-builtin-settings-'))
  try {
    await bundleBuiltinSettings({
      toRoot,
      workers: [{ settingName: 'develop.editorWorkerPath' }],
    })

    const index = JSON.parse(await readFile(join(toRoot, 'builtin-settings', 'index.json'), 'utf8'))
    const fileNames = await readdir(join(toRoot, 'builtin-settings'))
    expect(index).toEqual([])
    expect(fileNames).toEqual(['index.json'])
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
    { fileName: 'chat-view.json', settings: [settingA] },
    { fileName: 'chat-view-model.json', settings: [settingB] },
  ])
})

test('rejects conflicting settings contributions', () => {
  expect(() =>
    deduplicateSettingsContributions([
      { fileName: 'first.json', settings: [{ id: 'chat.enabled', value: true }] },
      { fileName: 'second.json', settings: [{ id: 'chat.enabled', value: false }] },
    ]),
  ).toThrow('Conflicting builtin setting chat.enabled')
})
