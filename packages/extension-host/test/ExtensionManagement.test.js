import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import VError from 'verror'
import * as ExtensionManagement from '../src/parts/ExtensionManagement/ExtensionManagement.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test('enable - no parameters', async () => {
  await expect(ExtensionManagement.enable()).rejects.toThrowError(
    new Error(`extension must be defined but is undefined`)
  )
})

test('enable - extension throws error on import', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'package.json'), `{ "type": "module" }`)
  await writeFile(
    join(tmpDir, 'main.js'),
    `throw new Error("Oops")
`
  )
  await expect(
    ExtensionManagement.enable({
      path: tmpDir,
      main: 'main.js',
      id: 'test-author.test-extension',
    })
  ).rejects.toThrowError(
    new VError('Failed to load extension "test-author.test-extension": Oops')
  )
})

test('enable - extension has no activate method', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'package.json'), `{ "type": "module" }`)
  await writeFile(join(tmpDir, 'main.js'), ``)
  await expect(
    ExtensionManagement.enable({
      path: tmpDir,
      main: 'main.js',
      id: 'test-author.test-extension',
    })
  ).rejects.toThrowError(
    new VError(
      'Failed to activate extension "test-author.test-extension": TypeError: module.activate is not a function'
    )
  )
})

test('enable - activate is not a function', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    join(tmpDir, 'package.json'),
    `{ "type": "module" }
`
  )
  await writeFile(
    join(tmpDir, 'main.js'),
    `export const activate = 42
`
  )
  await expect(
    ExtensionManagement.enable({
      path: tmpDir,
      main: 'main.js',
      id: 'test-author.test-extension',
    })
  ).rejects.toThrowError(
    new VError(
      'Failed to activate extension "test-author.test-extension": TypeError: module.activate is not a function'
    )
  )
})

test('enable - importing extension that has wrong main file throws error', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'package.json'), `{ "type": "module" }`)
  const wrongAbsolutePath = join(tmpDir, 'src', 'non-existent.js')
  await expect(
    ExtensionManagement.enable({
      path: `${tmpDir}`,
      main: 'src/non-existent.js',
      id: 'test-author.test-extension',
    })
  ).rejects.toThrowError(
    new VError(
      `Failed to load extension \"test-author.test-extension\": Cannot find module '${wrongAbsolutePath}' from 'src/parts/ExtensionManagement/ExtensionManagement.js'`
    )
  )
})

test('enable - reference error', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'package.json'), `{ "type": "module" }`)
  await writeFile(
    join(tmpDir, 'main.js'),
    `export const activate = () => {
  vscode.registerCommand(testCommand)
}
`
  )
  await expect(
    ExtensionManagement.enable({
      path: `${tmpDir}`,
      main: 'main.js',
      id: 'test-author.test-extension',
    })
  ).rejects.toThrowError(
    new VError(
      `Failed to activate extension \"test-author.test-extension\": ReferenceError: vscode is not defined`
    )
  )
})

test('enable - commonjs extension', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'package.json'), `{}`)
  await writeFile(
    join(tmpDir, 'main.js'),
    `exports.activate = () => {}
`
  )
  await ExtensionManagement.enable({
    path: `${tmpDir}`,
    main: 'main.js',
    id: 'test-author.test-extension',
  })
})

// TODO test disable
// TODO test disable throws error
// TODO disable, but disable function does not exist
// TODO test race condition: disable while extension is being enabled
