import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as Path from '../Path/Path.js'
import { root } from '../Root/Root.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import { writeJson } from '../JsonFile/JsonFile.js'

const getUniqueHeaders = (headers) => {
  const ours = []
  const indexes = []
  const seen = Object.create(null)
  for (const header of headers) {
    const stringified = JSON.stringify(header)
    if (stringified in seen) {
      indexes.push(seen[stringified])
    } else {
      seen[stringified] = ours.length
      ours.push(header)
      indexes.push(seen[stringified])
    }
  }
  return {
    ours,
    indexes,
  }
}

const generateHeadersCode = (ours, indexes, uris) => {
  const lines = []
  lines.push('export const headers = []')
  lines.push('')
  return lines.join('\n')
}

const generateFilesCodeMap = (indexes, uris) => {
  const map = Object.create(null)
  const length = indexes.length
  for (let i = 0; i < length; i++) {
    const index = indexes[i]
    const uri = uris[i]
    map[uri] = index
  }
  map['/'] = map['/index.html']
  return map
}

const generateFilesCode = (indexes, uris) => {
  const lines = []
  lines.push(`export const files = {}`)
  lines.push('')
  return lines.join('\n')
}

export const getStaticFiles = async ({ etag }) => {
  const staticFolder = Path.absolute(`packages/build/.tmp/server/static-server/static`)
  const dirents = await readdir(staticFolder, { recursive: true, withFileTypes: true })
  const files = dirents.filter((dirent) => dirent.isFile())
  const filePaths = files.map((file) => join(file.parentPath, file.name))
  const staticUri = pathToFileURL(staticFolder).toString()
  const staticUriLength = staticUri.length
  const uris = filePaths.map((filePath) => pathToFileURL(filePath).toString().slice(staticUriLength))
  const getHeadersPath = join(root, 'packages', 'static-server', 'src', 'parts', 'GetHeaders', 'GetHeaders.js')
  const getHeadersUri = pathToFileURL(getHeadersPath).toString()
  const getHeadersModule = await import(getHeadersUri)
  const isImmutable = 1
  const headers = filePaths.map((file) => getHeadersModule.getHeaders(file, etag, isImmutable))
  const uniqueHeaders = getUniqueHeaders(headers)
  const headersCode = generateHeadersCode(uniqueHeaders.ours, uniqueHeaders.indexes, uris)
  const headersCodePath = Path.absolute(`packages/build/.tmp/server/static-server/src/parts/Headers/Headers.js`)
  await WriteFile.writeFile({ to: headersCodePath, content: headersCode })
  const filesCode = generateFilesCode(uniqueHeaders.indexes, uris)
  const filesCodePath = Path.absolute(`packages/build/.tmp/server/static-server/src/parts/Files/Files.js`)
  await WriteFile.writeFile({
    to: filesCodePath,
    content: filesCode,
  })
  const configJsonPath = Path.absolute(`packages/build/.tmp/server/static-server/config.json`)
  const map = generateFilesCodeMap(uniqueHeaders.indexes, uris)
  await writeJson({
    to: configJsonPath,
    value: {
      etag,
      headers: uniqueHeaders.ours,
      files: map,
    },
  })
}
