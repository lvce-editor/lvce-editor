import { expect, test } from '@jest/globals'
import * as FilterMainProcessDependencies from '../src/parts/FilterMainProcessDependencies/FilterMainProcessDependencies.ts'

const makeDependency = (name, dependencies = {}) => ({
  name,
  path: `/project/node_modules/${name}`,
  dependencies,
})

test('keeps only the Electron version CLI runtime dependencies when the main process is bundled', () => {
  const rawDependencies = makeDependency('@lvce-editor/main-process', {
    electron: makeDependency('electron'),
    '@electron/get': makeDependency('@electron/get', {
      debug: makeDependency('debug', {
        ms: makeDependency('ms'),
      }),
      sumchecker: makeDependency('sumchecker', {
        debug: makeDependency('debug'),
      }),
    }),
    '@electron-internal/extract-zip': makeDependency('@electron-internal/extract-zip', {
      yauzl: makeDependency('yauzl'),
    }),
    '@lvce-editor/assert': makeDependency('@lvce-editor/assert'),
    'native-module': makeDependency('native-module'),
  })

  expect(FilterMainProcessDependencies.filterDependencies(rawDependencies, false, true)).toEqual([
    '/project/node_modules/@electron/get',
    '/project/node_modules/debug',
    '/project/node_modules/ms',
    '/project/node_modules/sumchecker',
    '/project/node_modules/@electron-internal/extract-zip',
    '/project/node_modules/yauzl',
  ])
})

test('writes only Electron version CLI dependencies to a bundled main-process manifest', () => {
  expect(
    FilterMainProcessDependencies.filterPackageDependencies(
      {
        electron: '44.7.0',
        '@electron/get': '^5.1.0',
        '@electron-internal/extract-zip': '^1.0.5',
        '@lvce-editor/assert': '^1.9.0',
      },
      true,
    ),
  ).toEqual({
    '@electron/get': '^5.1.0',
    '@electron-internal/extract-zip': '^1.0.5',
  })
})

test('keeps the complete dependency manifest when the main process is not bundled', () => {
  const dependencies = { electron: '44.7.0', '@lvce-editor/assert': '^1.9.0' }

  expect(FilterMainProcessDependencies.filterPackageDependencies(dependencies, false)).toBe(dependencies)
})

test('keeps all main-process dependencies when the main process is not bundled', () => {
  const rawDependencies = makeDependency('@lvce-editor/main-process-legacy', {
    electron: makeDependency('electron'),
    '@electron/get': makeDependency('@electron/get', {
      debug: makeDependency('debug'),
    }),
    '@lvce-editor/assert': makeDependency('@lvce-editor/assert'),
  })

  expect(FilterMainProcessDependencies.filterDependencies(rawDependencies, false, false)).toEqual([
    '/project/node_modules/electron',
    '/project/node_modules/@electron/get',
    '/project/node_modules/debug',
    '/project/node_modules/@lvce-editor/assert',
  ])
})
