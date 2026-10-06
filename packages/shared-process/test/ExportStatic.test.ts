import { expect, test } from '@jest/globals'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { mergeExtensionManifests, mergeWebExtensionManifests, transpileFile, validateRendererProcessArtifacts } from '../src/parts/ExportStatic/ExportStatic.js'

test('transpileFile removes typescript annotations', () => {
  const content = `const value: number = 1
export const getValue = (): number => value
`

  expect(transpileFile(content)).toContain(`export const getValue = ()         => value`)
})

test('transpileFile rewrites relative typescript imports to javascript imports', () => {
  const content = `import { helper } from './helper.ts'
export { helper as staticHelper } from './helper.ts'
const loadHelper = () => import('./helper.ts')
`

  const result = transpileFile(content)

  expect(result).toContain(`from './helper.js'`)
  expect(result).toContain(`import('./helper.js')`)
  expect(result).not.toContain('.ts')
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

test('mergeWebExtensionManifests preserves other builtins and replaces matching extensions', () => {
  const builtinChat = {
    id: 'builtin.chat-view-2',
    path: '/static/hash/extensions/builtin.chat-view-2',
  }
  const builtinGit = {
    id: 'builtin.git',
    path: '/static/hash/extensions/builtin.git',
  }
  const localChat = {
    id: 'builtin.chat-view-2',
    path: '/chat/hash/extensions/builtin.chat-view-2',
  }
  const localExtension = {
    id: 'test.local-extension',
    path: '/chat/hash/extensions/test.local-extension',
  }

  expect(mergeWebExtensionManifests([builtinChat, builtinGit], [localChat, localExtension])).toEqual([localChat, builtinGit, localExtension])
})

test('mergeWebExtensionManifests supports simple extension path entries', () => {
  expect(
    mergeWebExtensionManifests(['/static/hash/extensions/builtin.chat-view-2', '/static/hash/extensions/builtin.git'], [
      '/chat/hash/extensions/builtin.chat-view-2',
      '/chat/hash/extensions/test.local-extension',
    ]),
  ).toEqual([
    '/chat/hash/extensions/builtin.chat-view-2',
    '/static/hash/extensions/builtin.git',
    '/chat/hash/extensions/test.local-extension',
  ])
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
