import { expect, test } from '@jest/globals'
import { getSettingsContributionCandidates } from '../src/parts/BundleBuiltinSettings/BundleBuiltinSettings.ts'

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
