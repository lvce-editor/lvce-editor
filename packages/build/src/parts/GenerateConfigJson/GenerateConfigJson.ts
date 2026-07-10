import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { writeJson } from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'
import { root } from '../Root/Root.ts'

const getUniqueHeaders = (headers) => {
  const ours: any[] = []
  const indexes: any[] = []
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

const generateFilesCodeMap = (indexes, uris) => {
  const map = Object.create(null)
  const length = indexes.length
  for (let i = 0; i < length; i++) {
    const index = indexes[i]
    const uri = uris[i]
    map[uri] = index
  }
  map['/'] = map['/index.html']
  map['/auth/callback'] = map['/auth/callback.html']
  return map
}

// TODO merge this with getStaticFiles
export const generateConfigJson = async ({
  etag,
  staticRoot,
  configRoot,
  applicationName,
  name,
  productName,
  version,
  electronVersion,
  commitHash,
}) => {
  const staticFolder = Path.absolute(`${staticRoot}/static`)
  const dirents = await readdir(staticFolder, { recursive: true, withFileTypes: true })
  const files = dirents.filter((dirent) => dirent.isFile())
  const filePaths = files.map((file) => join(file.parentPath, file.name))
  const staticUri = pathToFileURL(staticFolder).toString()
  const staticUriLength = staticUri.length
  const uris = filePaths.map((filePath) => pathToFileURL(filePath).toString().slice(staticUriLength))
  const getHeadersPath = join(root, 'packages', 'static-server', 'src', 'parts', 'GetHeaders', 'GetHeaders.ts')
  const getHeadersUri = pathToFileURL(getHeadersPath).toString()
  const getHeadersModule = await import(getHeadersUri)
  const isImmutable = 1
  const headers = filePaths.map((absolutePath) =>
    getHeadersModule.getHeaders({
      absolutePath,
      etag,
      isImmutable,
      isForElectronProduction: true,
      applicationName,
    }),
  )
  const uniqueHeaders = getUniqueHeaders(headers)
  const configJsonPath = Path.absolute(`${configRoot}/config.json`)
  const map = generateFilesCodeMap(uniqueHeaders.indexes, uris)
  await writeJson({
    to: configJsonPath,
    value: {
      name,
      productName,
      version,
      electronVersion,
      commit: commitHash,
      etag,
      headers: uniqueHeaders.ours,
      files: map,
    },
  })
}
