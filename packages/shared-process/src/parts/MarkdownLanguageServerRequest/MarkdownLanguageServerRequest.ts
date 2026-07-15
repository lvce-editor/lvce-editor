import MarkdownIt from 'markdown-it'
import { readFile, readdir, stat } from 'node:fs/promises'
import { isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

interface DocumentState {
  readonly text: string
}

export interface MarkdownLanguageServerRequestContext {
  readonly documents: ReadonlyMap<string, DocumentState>
  readonly rootUri: string
}

interface MarkdownRequestParams {
  readonly text?: string
  readonly uri?: string
}

const markdownFileExtensions = new Set(['.markdown', '.md', '.mdown', '.mdtext', '.mdtxt', '.mdwn', '.mkd', '.mkdn'])
const ignoredDirectories = new Set(['.git', 'node_modules'])
const markdownIt = new MarkdownIt({ html: true })

export const isMarkdownLanguageServerRequest = (method: string): boolean => {
  return (
    method === 'markdown/parse' ||
    method === 'markdown/fs/readFile' ||
    method === 'markdown/fs/readDirectory' ||
    method === 'markdown/fs/stat' ||
    method === 'markdown/fs/watcher/create' ||
    method === 'markdown/fs/watcher/delete' ||
    method === 'markdown/findMarkdownFilesInWorkspace'
  )
}

const getWorkspacePath = (uri: string, rootUri: string): string => {
  const rootPath = resolve(fileURLToPath(rootUri))
  const targetPath = resolve(fileURLToPath(uri))
  const relativePath = relative(rootPath, targetPath)
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error(`Language server file request is outside the workspace`)
  }
  return targetPath
}

const getMarkdownText = async (params: MarkdownRequestParams, context: MarkdownLanguageServerRequestContext): Promise<string> => {
  if (typeof params.text === 'string') {
    return params.text
  }
  if (!params.uri) {
    throw new Error(`Markdown parse request is missing a uri`)
  }
  const document = context.documents.get(params.uri)
  if (document) {
    return document.text
  }
  const path = getWorkspacePath(params.uri, context.rootUri)
  return readFile(path, 'utf8')
}

const findMarkdownFiles = async (rootPath: string): Promise<readonly string[]> => {
  const result: string[] = []
  const visit = async (directory: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true })
    await Promise.all(
      entries.map(async (entry): Promise<void> => {
        const path = resolve(directory, entry.name)
        if (entry.isDirectory()) {
          if (ignoredDirectories.has(entry.name)) {
            return
          }
          await visit(path)
          return
        }
        const extensionIndex = entry.name.lastIndexOf('.')
        const extension = extensionIndex === -1 ? '' : entry.name.slice(extensionIndex).toLowerCase()
        if (markdownFileExtensions.has(extension)) {
          result.push(pathToFileURL(path).href)
        }
      }),
    )
  }
  await visit(rootPath)
  return result.sort()
}

export const executeMarkdownLanguageServerRequest = async (
  method: string,
  params: MarkdownRequestParams,
  context: MarkdownLanguageServerRequestContext,
): Promise<unknown> => {
  if (method === 'markdown/parse') {
    return markdownIt.parse(await getMarkdownText(params, context), {})
  }
  if (method === 'markdown/findMarkdownFilesInWorkspace') {
    return findMarkdownFiles(getWorkspacePath(context.rootUri, context.rootUri))
  }
  if (method === 'markdown/fs/watcher/create' || method === 'markdown/fs/watcher/delete') {
    return null
  }
  if (!params.uri) {
    throw new Error(`Markdown file request is missing a uri`)
  }
  const path = getWorkspacePath(params.uri, context.rootUri)
  if (method === 'markdown/fs/readFile') {
    return [...(await readFile(path))]
  }
  if (method === 'markdown/fs/readDirectory') {
    const entries = await readdir(path, { withFileTypes: true })
    return entries.map((entry) => [entry.name, { isDirectory: entry.isDirectory() }])
  }
  if (method === 'markdown/fs/stat') {
    try {
      const fileStat = await stat(path)
      return { isDirectory: fileStat.isDirectory() }
    } catch {
      return undefined
    }
  }
  throw new Error(`Unsupported Markdown language server request: ${method}`)
}
