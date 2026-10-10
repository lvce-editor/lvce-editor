import { open, readFile } from 'node:fs/promises'
import type { ByteRange } from '../GetByteRange/GetByteRange.ts'
import * as AddCustomPathsToIndexHtml from '../AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.ts'
import * as Platform from '../Platform/Platform.ts'
import * as ShouldTranspileTypescript from '../ShouldTranspileTypescript/ShouldTranspileTypescript.ts'
import * as TranspileTypeScript from '../TranspileTypeScript/TranspileTypeScript.ts'

const useCache = false // TODO enable this

const getWorkspaceUri = (url: string): string | undefined => {
  const baseUrl = `${Platform.scheme}://-/`
  if (!URL.canParse(url, baseUrl)) {
    return undefined
  }
  return new URL(url, baseUrl).searchParams.get('workspace') || undefined
}

const readRange = async (absolutePath: string, range: ByteRange): Promise<Buffer> => {
  const length = range.end - range.start + 1
  const buffer = Buffer.allocUnsafe(length)
  const file = await open(absolutePath, 'r')
  try {
    const { bytesRead } = await file.read(buffer, 0, length, range.start)
    return buffer.subarray(0, bytesRead)
  } finally {
    await file.close()
  }
}

export const getElectronFileResponseContent = async (request: any, absolutePath: any, url: any, range?: ByteRange): Promise<any> => {
  if (range) {
    return readRange(absolutePath, range)
  }
  if (ShouldTranspileTypescript.shouldTranspileTypescript(request, url)) {
    const content = await readFile(absolutePath)
    const newContent = await TranspileTypeScript.transpileTypeScript(content.toString(), useCache)
    if (typeof newContent === 'string') {
      return Buffer.from(newContent)
    }
    const newContentString = newContent.outputText
    const newContentBuffer = Buffer.from(newContentString)
    return newContentBuffer
  }
  let content = await readFile(absolutePath)
  const isAppIndex = typeof url === 'string' && (url === '/' || (url.startsWith(`${Platform.scheme}://-/`) && new URL(url).pathname === '/'))
  const runtimeConfig = { platform: 'electron', workspaceUri: getWorkspaceUri(request?.url || url) }
  if (!Platform.isProduction && isAppIndex) {
    // @ts-ignore
    content = content.toString().replace('    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n', '')
    content = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content, runtimeConfig)
  }
  if (Platform.isProduction && isAppIndex) {
    content = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(content, runtimeConfig)
  }
  if (typeof content === 'string') {
    content = Buffer.from(content)
  }
  return content
}
