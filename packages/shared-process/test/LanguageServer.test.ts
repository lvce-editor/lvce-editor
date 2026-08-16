import { afterEach, expect, test } from '@jest/globals'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as LanguageServerIpc from '../src/parts/LanguageServer/LanguageServer.ipc.ts'
import {
  codeAction,
  complete,
  definition,
  diagnostic,
  dispose,
  disposeAll,
  format,
  references,
  type CompleteOptions,
} from '../src/parts/LanguageServer/LanguageServer.ts'
import { getSpawnOptions } from '../src/parts/LanguageServerConnection/LanguageServerConnection.ts'
import { normalizeLanguageServerDocumentUri } from '../src/parts/NormalizeLanguageServerDocumentUri/NormalizeLanguageServerDocumentUri.ts'

const serverScript = fileURLToPath(new URL('./fixtures/languageServer.js', import.meta.url))
const completionOnlyServerScript = fileURLToPath(new URL('./fixtures/languageServerCompletionOnly.js', import.meta.url))
const pushDiagnosticsServerScript = fileURLToPath(new URL('./fixtures/languageServerPushDiagnostics.js', import.meta.url))

afterEach(() => {
  disposeAll()
})

test('exposes bulk disposal over IPC', () => {
  expect(LanguageServerIpc.Commands.disposeAll).toBe(disposeAll)
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
    extensionId: 'sample.extension',
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
    extensionId: 'sample.extension',
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

test('codeAction sends relevant diagnostics and synchronizes documents', async () => {
  const options = {
    argv: [serverScript],
    extensionId: 'sample.extension',
    id: 'sample.code-action-fixture',
    offset: 2,
    textDocument: {
      languageId: 'elm',
      text: 'unused',
      uri: '/tmp/Main.elm',
    },
    uri: pathToFileURL(process.execPath).href,
  }
  const normalizedDocumentUri = normalizeLanguageServerDocumentUri(options.textDocument.uri)

  await expect(codeAction(options)).resolves.toEqual([
    {
      edit: {
        changes: {
          [normalizedDocumentUri]: [
            {
              newText: 'fixed',
              range: {
                end: { character: 2, line: 0 },
                start: { character: 2, line: 0 },
              },
            },
          ],
        },
      },
      kind: 'quickfix',
      title: 'fixtureCodeAction:unused:1',
    },
  ])
})

test('codeAction returns no actions when the language server does not support them', async () => {
  await expect(
    codeAction({
      argv: [completionOnlyServerScript],
      extensionId: 'sample.extension',
      id: 'sample.completion-only-code-action-fixture',
      offset: 2,
      textDocument: {
        languageId: 'typescript',
        text: 'const value = 1',
        uri: '/tmp/sample.ts',
      },
      uri: pathToFileURL(process.execPath).href,
    }),
  ).resolves.toEqual([])
})

test('definition starts a stdio language server and synchronizes documents', async () => {
  const options = {
    argv: [serverScript],
    extensionId: 'sample.extension',
    id: 'sample.definition-fixture',
    offset: 15,
    rootUri: 'file:///tmp',
    textDocument: {
      languageId: 'elm',
      text: 'value = 1\nmain = value',
      uri: '/tmp/Main.elm',
    },
    uri: pathToFileURL(process.execPath).href,
  }
  const normalizedDocumentUri = normalizeLanguageServerDocumentUri(options.textDocument.uri)

  await expect(definition(options)).resolves.toEqual({
    range: {
      end: { character: 7, line: 1 },
      start: { character: 0, line: 1 },
    },
    uri: `${normalizedDocumentUri}?definition=value%20%3D%201%0Amain%20%3D%20value`,
  })
})

test('references starts a stdio language server and includes declarations', async () => {
  const options = {
    argv: [serverScript],
    extensionId: 'sample.extension',
    id: 'sample.references-fixture',
    offset: 15,
    rootUri: 'file:///tmp',
    textDocument: {
      languageId: 'zig',
      text: 'const value = 1;\n_ = value;',
      uri: '/tmp/main.zig',
    },
    uri: pathToFileURL(process.execPath).href,
  }
  const normalizedDocumentUri = normalizeLanguageServerDocumentUri(options.textDocument.uri)

  await expect(references(options)).resolves.toEqual([
    {
      range: {
        end: { character: 5, line: 0 },
        start: { character: 0, line: 0 },
      },
      uri: `${normalizedDocumentUri}?references=const%20value%20%3D%201%3B%0A_%20%3D%20value%3B&includeDeclaration=true`,
    },
  ])
})

test('diagnostic starts a stdio language server and synchronizes documents', async () => {
  const options = {
    argv: [serverScript],
    extensionId: 'sample.extension',
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

test('format starts a stdio language server and synchronizes documents', async () => {
  const options = {
    argv: [serverScript],
    extensionId: 'sample.extension',
    id: 'sample.fixture',
    textDocument: {
      languageId: 'elm',
      text: 'main = 1',
      uri: '/tmp/Main.elm',
    },
    uri: pathToFileURL(process.execPath).href,
  }

  await expect(format(options)).resolves.toEqual([
    {
      newText: 'formatted:main = 1',
      range: {
        end: { character: 8, line: 0 },
        start: { character: 0, line: 0 },
      },
    },
  ])
})

test('format returns no edits when the language server does not support document formatting', async () => {
  await expect(
    format({
      argv: [completionOnlyServerScript],
      extensionId: 'sample.extension',
      id: 'sample.completion-only-fixture',
      textDocument: {
        languageId: 'typescript',
        text: 'const value=1',
        uri: '/tmp/sample.ts',
      },
      uri: pathToFileURL(process.execPath).href,
    }),
  ).resolves.toEqual([])
})

test('references returns no locations when the language server does not support them', async () => {
  await expect(
    references({
      argv: [completionOnlyServerScript],
      extensionId: 'sample.extension',
      id: 'sample.completion-only-references-fixture',
      offset: 2,
      textDocument: {
        languageId: 'typescript',
        text: 'const value = 1',
        uri: '/tmp/sample.ts',
      },
      uri: pathToFileURL(process.execPath).href,
    }),
  ).resolves.toEqual([])
})

test('diagnostic supports published diagnostics and uses the provided workspace root', async () => {
  const options = {
    argv: [pushDiagnosticsServerScript],
    extensionId: 'sample.extension',
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
    extensionId: 'sample.extension',
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
    extensionId: 'sample.extension',
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

test('dispose stops every language server owned by an extension', async () => {
  const createOptions = (extensionId: string, serverId = 'fixture'): CompleteOptions => ({
    argv: [serverScript, '--include-process-id'],
    extensionId,
    id: `${extensionId}.${serverId}`,
    offset: 3,
    textDocument: {
      languageId: 'typescript',
      text: 'con',
      uri: '/tmp/sample.ts',
    },
    uri: pathToFileURL(process.execPath).href,
  })
  const firstExtensionOptions = createOptions('sample.first-extension')
  const firstExtensionSecondServerOptions = createOptions('sample.first-extension', 'second-fixture')
  const secondExtensionOptions = createOptions('sample.second-extension')
  const getProcessId = async (options: CompleteOptions): Promise<string> => {
    const result = (await complete(options)) as readonly { readonly label: string }[]
    return result[0].label.split(':').at(-1) || ''
  }
  const firstProcessId = await getProcessId(firstExtensionOptions)
  const firstExtensionSecondProcessId = await getProcessId(firstExtensionSecondServerOptions)
  const secondProcessId = await getProcessId(secondExtensionOptions)

  dispose('sample.first-extension')

  await expect(getProcessId(firstExtensionOptions)).resolves.not.toBe(firstProcessId)
  await expect(getProcessId(firstExtensionSecondServerOptions)).resolves.not.toBe(firstExtensionSecondProcessId)
  await expect(getProcessId(secondExtensionOptions)).resolves.toBe(secondProcessId)
})
