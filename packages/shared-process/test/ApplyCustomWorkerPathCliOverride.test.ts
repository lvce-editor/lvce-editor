import { afterEach, expect, test } from '@jest/globals'
import * as ApplyCustomWorkerPathCliOverride from '../src/parts/ApplyCustomWorkerPathCliOverride/ApplyCustomWorkerPathCliOverride.js'

const originalArgv = process.argv

afterEach(() => {
  process.argv = originalArgv
})

test('applyCustomWorkerPathCliOverride - keeps custom worker paths by default', () => {
  const preferences = {
    'develop.editorWorkerPath': '/test/editor-worker',
  }

  expect(ApplyCustomWorkerPathCliOverride.applyCustomWorkerPathCliOverride(preferences)).toBe(preferences)
})

test('applyCustomWorkerPathCliOverride - removes custom worker paths when disabled from the command line', () => {
  process.argv = [...originalArgv, '--disable-custom-worker-paths']
  const preferences = {
    'develop.editorWorkerPath': '/test/editor-worker',
    'develop.languageModelsViewPath': '/test/language-models-view-worker',
    'develop.rendererProcessPath': '/test/renderer-process',
    'develop.runningExtensionsViewPath': '/test/running-extensions-view-worker',
    'developer.syntaxHighlightingWorkerPath': '/test/syntax-highlighting-worker',
    'workbench.colorTheme': 'test-theme',
  }

  expect(ApplyCustomWorkerPathCliOverride.applyCustomWorkerPathCliOverride(preferences)).toEqual({
    'develop.rendererProcessPath': '/test/renderer-process',
    'workbench.colorTheme': 'test-theme',
  })
})
