import { readFile } from 'fs/promises'
import { extname } from 'path'
import * as GetElectronFileResponseAbsolutePath from '../GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'
import * as GetElectronFileResponseRelativePath from '../GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.js'
import * as Platform from '../Platform/Platform.js'

const getMimeType = (fileExtension) => {
  switch (fileExtension) {
    case '.html':
      return 'text/html'
    case '.css':
      return 'text/css'
    case '.ttf':
      return 'font/ttf'
    case '.js':
      return 'text/javascript'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    default:
      console.log(fileExtension)
      return ''
  }
}

export const getElectronFileResponse = async (url) => {
  const pathName = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)
  let content = await readFile(absolutePath)
  if (!Platform.isProduction && url === `${Platform.scheme}://-/`) {
    // @ts-ignore
    content = content.toString().replace('    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials" />\n', '')
  }
  const extension = extname(absolutePath)
  const mime = getMimeType(extension)
  return {
    body: content,
    init: {
      status: 200,
      headers: {
        'Content-Type': mime,
      },
    },
  }
}
