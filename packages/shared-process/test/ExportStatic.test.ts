import { expect, test } from '@jest/globals'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { mergeExtensionManifests, transpileFile, validateRendererProcessArtifacts } from '../src/parts/ExportStatic/ExportStatic.js'

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

test('validateRendererProcessArtifacts accepts copied renderer process chunks', async () => {
  const root = join(tmpdir(), `lvce-static-export-${process.pid}`)
  const commitHash = 'abcdefg'
  const rendererProcessDistPath = join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist')
  try {
    await mkdir(rendererProcessDistPath, { recursive: true })
    await writeFile(join(rendererProcessDistPath, 'rendererProcessMain.js'), '')
    await writeFile(join(rendererProcessDistPath, 'xterm.js'), '')

    expect(() => validateRendererProcessArtifacts({ commitHash, root })).not.toThrow()
  } finally {
    await rm(root, { force: true, recursive: true })
  }
})

test('validateRendererProcessArtifacts rejects a missing xterm chunk', async () => {
  const root = join(tmpdir(), `lvce-static-export-missing-${process.pid}`)
  const commitHash = 'abcdefg'
  const rendererProcessDistPath = join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist')
  try {
    await mkdir(rendererProcessDistPath, { recursive: true })
    await writeFile(join(rendererProcessDistPath, 'rendererProcessMain.js'), '')

    expect(() => validateRendererProcessArtifacts({ commitHash, root })).toThrow('renderer process artifact not found')
  } finally {
    await rm(root, { force: true, recursive: true })
  }
})
