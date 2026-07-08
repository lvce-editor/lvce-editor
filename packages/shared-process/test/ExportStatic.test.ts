import { expect, test } from '@jest/globals'
import { mergeExtensionManifests, transpileFile } from '../src/parts/ExportStatic/ExportStatic.js'

test('transpileFile removes typescript annotations', () => {
  const content = `const value: number = 1
export const getValue = (): number => value
`

  expect(transpileFile(content)).toContain(`export const getValue = ()         => value`)
})

test('mergeExtensionManifests replaces existing extension with matching id', () => {
  const builtinCobalt = {
    id: 'builtin.theme-cobalt2',
    name: 'Cobalt 2 Theme',
    path: '/static/hash/extensions/builtin.theme-cobalt2',
    source: 'builtin',
  }
  const localCobalt = {
    id: 'builtin.theme-cobalt2',
    name: 'Cobalt 2 Theme',
    path: '/theme-cobalt2/hash/extensions/builtin.theme-cobalt2',
    source: 'local',
  }
  const material = {
    id: 'builtin.theme-material',
    name: 'Material Theme',
    path: '/static/hash/extensions/builtin.theme-material',
    source: 'builtin',
  }

  expect(mergeExtensionManifests([builtinCobalt, material], [localCobalt])).toEqual([localCobalt, material])
})

test('mergeExtensionManifests appends local extension when id is new', () => {
  const builtinExtension = {
    id: 'builtin.theme-material',
    name: 'Material Theme',
  }
  const localExtension = {
    id: 'test.local-extension',
    name: 'Local Extension',
  }

  expect(mergeExtensionManifests([builtinExtension], [localExtension])).toEqual([builtinExtension, localExtension])
})
