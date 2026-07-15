import { expect, test } from '@jest/globals'
import { pathToFileURL } from 'node:url'
import {
  executeMarkdownLanguageServerRequest,
  isMarkdownLanguageServerRequest,
} from '../src/parts/MarkdownLanguageServerRequest/MarkdownLanguageServerRequest.ts'

const rootUri = new URL('./fixtures/markdownLanguageServerRequest/', import.meta.url).href
const readmeUri = new URL('README.md', rootUri).href
const context = {
  documents: new Map([[readmeUri, { text: '# In-memory heading' }]]),
  rootUri,
}

test('recognizes Markdown language server requests', () => {
  expect(isMarkdownLanguageServerRequest('markdown/parse')).toBe(true)
  expect(isMarkdownLanguageServerRequest('markdown/fs/watcher/create')).toBe(true)
  expect(isMarkdownLanguageServerRequest('markdown/fs/watcher/delete')).toBe(true)
  expect(isMarkdownLanguageServerRequest('workspace/configuration')).toBe(false)
})

test('acknowledges Markdown file watcher requests', async () => {
  await expect(executeMarkdownLanguageServerRequest('markdown/fs/watcher/create', {}, context)).resolves.toBeNull()
  await expect(executeMarkdownLanguageServerRequest('markdown/fs/watcher/delete', {}, context)).resolves.toBeNull()
})

test('parses the current in-memory Markdown document', async () => {
  const tokens = (await executeMarkdownLanguageServerRequest('markdown/parse', { uri: readmeUri }, context)) as readonly {
    readonly type: string
  }[]

  expect(tokens.map((token) => token.type)).toEqual(['heading_open', 'inline', 'heading_close'])
})

test('parses temporary Markdown text supplied by the server', async () => {
  const tokens = (await executeMarkdownLanguageServerRequest('markdown/parse', { text: '# Temporary' }, context)) as readonly {
    readonly type: string
  }[]

  expect(tokens.map((token) => token.type)).toEqual(['heading_open', 'inline', 'heading_close'])
})

test('reads workspace files as bytes', async () => {
  const result = (await executeMarkdownLanguageServerRequest('markdown/fs/readFile', { uri: readmeUri }, context)) as readonly number[]

  expect(Buffer.from(result).toString()).toContain('# Workspace heading')
})

test('reads workspace directories', async () => {
  const result = (await executeMarkdownLanguageServerRequest('markdown/fs/readDirectory', { uri: rootUri }, context)) as readonly [
    string,
    { readonly isDirectory: boolean },
  ][]

  expect(result).toContainEqual(['guide.md', { isDirectory: false }])
  expect(result).toContainEqual(['nested', { isDirectory: true }])
})

test('stats workspace files and missing files', async () => {
  await expect(executeMarkdownLanguageServerRequest('markdown/fs/stat', { uri: readmeUri }, context)).resolves.toEqual({
    isDirectory: false,
  })
  await expect(
    executeMarkdownLanguageServerRequest('markdown/fs/stat', { uri: new URL('missing.md', rootUri).href }, context),
  ).resolves.toBeUndefined()
})

test('finds Markdown files in the workspace', async () => {
  await expect(executeMarkdownLanguageServerRequest('markdown/findMarkdownFilesInWorkspace', {}, context)).resolves.toEqual([
    new URL('README.md', rootUri).href,
    new URL('guide.md', rootUri).href,
    new URL('nested/details.markdown', rootUri).href,
  ])
})

test('rejects file requests outside the workspace', async () => {
  await expect(executeMarkdownLanguageServerRequest('markdown/fs/readFile', { uri: pathToFileURL('/tmp/outside.md').href }, context)).rejects.toThrow(
    'outside the workspace',
  )
})
