import { afterEach, expect, test } from '@jest/globals'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { complete, diagnostic, disposeAll } from '../src/parts/LanguageServer/LanguageServer.ts'

const serverScript = fileURLToPath(new URL('./fixtures/languageServer.js', import.meta.url))

afterEach(() => {
  disposeAll()
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
