import { afterEach, expect, test } from '@jest/globals'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { complete, diagnostic, disposeAll } from '../src/parts/LanguageServer/LanguageServer.ts'
import { getSpawnOptions } from '../src/parts/LanguageServerConnection/LanguageServerConnection.ts'

const serverScript = fileURLToPath(new URL('./fixtures/languageServer.js', import.meta.url))
const completionOnlyServerScript = fileURLToPath(new URL('./fixtures/languageServerCompletionOnly.js', import.meta.url))
const pushDiagnosticsServerScript = fileURLToPath(new URL('./fixtures/languageServerPushDiagnostics.js', import.meta.url))

afterEach(() => {
  disposeAll()
})

test('JavaScript language servers use Electron as Node', () => {
  const serverUri = pathToFileURL('/tmp/language-server.mjs').href
  const serverPath = fileURLToPath(serverUri)

  expect(getSpawnOptions(serverUri, ['--stdio'])).toMatchObject({
    args: [serverPath, '--stdio'],
    command: process.execPath,
    env: {
      ELECTRON_RUN_AS_NODE: '1',
    },
  })
})

test('native language servers inherit the current environment unchanged', () => {
  const serverUri = pathToFileURL('/tmp/language-server').href
  const serverPath = fileURLToPath(serverUri)

  expect(getSpawnOptions(serverUri, ['--stdio'])).toEqual({
    args: ['--stdio'],
    command: serverPath,
  })
})

test('complete starts a stdio language server and synchronizes documents', async () => {
  const options = {
    argv: [serverScript],
    id: 'sample.fixture',
    offset: 3,
    textDocument: {
      languageId: 'typescript',
      text: 'con',
      uri: '/tmp/sample.ts',
    },
    uri: pathToFileURL(process.execPath).href,
  }

  await expect(complete(options)).resolves.toEqual([{ insertText: 'fixtureCompletion', kind: 6, label: 'fixtureCompletion:con' }])
  await expect(
    complete({
      ...options,
      offset: 7,
      textDocument: {
        ...options.textDocument,
        text: 'console',
      },
    }),
  ).resolves.toEqual([{ insertText: 'fixtureCompletion', kind: 6, label: 'fixtureCompletion:console' }])
})

test('complete starts a JavaScript language server', async () => {
  const options = {
    argv: [],
    id: 'sample.javascript-fixture',
    offset: 3,
    textDocument: {
      languageId: 'typescript',
      text: 'con',
      uri: '/tmp/sample.ts',
    },
    uri: pathToFileURL(serverScript).href,
  }

  await expect(complete(options)).resolves.toEqual([{ insertText: 'fixtureCompletion', kind: 6, label: 'fixtureCompletion:con' }])
})

test('diagnostic starts a stdio language server and synchronizes documents', async () => {
  const options = {
    argv: [serverScript],
    id: 'sample.fixture',
    textDocument: {
      languageId: 'markdown',
      text: '[link][missing]',
      uri: '/tmp/README.md',
    },
    uri: pathToFileURL(process.execPath).href,
  }

  await expect(diagnostic(options)).resolves.toEqual([
    {
      message: 'fixtureDiagnostic:[link][missing]',
      range: {
        end: { character: 3, line: 0 },
        start: { character: 0, line: 0 },
      },
      severity: 2,
    },
  ])
})

test('diagnostic supports published diagnostics and uses the provided workspace root', async () => {
  const options = {
    argv: [pushDiagnosticsServerScript],
    id: 'sample.push-diagnostics-fixture',
    rootUri: 'file:///tmp/sample-workspace',
    textDocument: {
      languageId: 'elm',
      text: 'invalid',
      uri: '/tmp/sample-workspace/src/Main.elm',
    },
    uri: pathToFileURL(process.execPath).href,
  }

  await expect(diagnostic(options)).resolves.toEqual([
    {
      message: 'fixtureDiagnostic:invalid:file:///tmp/sample-workspace',
      range: {
        end: { character: 3, line: 0 },
        start: { character: 0, line: 0 },
      },
      severity: 2,
    },
  ])
  await expect(
    diagnostic({
      ...options,
      textDocument: {
        ...options.textDocument,
        text: 'valid',
      },
    }),
  ).resolves.toEqual([])
})

test('diagnostic normalizes Windows URIs published by a language server', async () => {
  const options = {
    argv: [pushDiagnosticsServerScript, '--uppercase-windows-uri'],
    id: 'sample.windows-push-diagnostics-fixture',
    rootUri: 'file:///D:/workspace',
    textDocument: {
      languageId: 'erlang',
      text: 'invalid',
      uri: 'file:///D:/workspace/src/main.erl',
    },
    uri: pathToFileURL(process.execPath).href,
  }

  await expect(diagnostic(options)).resolves.toEqual([
    {
      message: 'fixtureDiagnostic:invalid:file:///d:/workspace',
      range: {
        end: { character: 3, line: 0 },
        start: { character: 0, line: 0 },
      },
      severity: 2,
    },
  ])
})

test('diagnostic resolves when a completion-only server does not publish diagnostics', async () => {
  const options = {
    argv: [completionOnlyServerScript],
    id: 'sample.completion-only-fixture',
    textDocument: {
      languageId: 'typescript',
      text: 'const value = 1',
      uri: '/tmp/sample.ts',
    },
    uri: pathToFileURL(process.execPath).href,
  }

  await expect(diagnostic(options)).resolves.toEqual([])
}, 2000)
