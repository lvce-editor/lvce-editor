import { createWriteStream } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'
import got, { HTTPError } from 'got'
import { pipeline } from 'node:stream/promises'
import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'

const downloadFile = async (url, outFile) => {
  try {
    await Mkdir.mkdir(Path.dirname(outFile))
    await pipeline(got.stream(url), createWriteStream(outFile))
  } catch (error) {
    try {
      await rm(outFile, { recursive: true, force: true })
    } catch {}
    if (error && error instanceof HTTPError) {
      throw new VError(`Failed to download "${url}": ${error.message}`)
    }
    // @ts-ignore
    throw new VError(error, `Failed to download "${url}"`)
  }
}

const downloadStaticFileCss = async (staticFile) => {
  Assert.string(staticFile.path)
  const packageName = staticFile.name
  const packageVersion = staticFile.version
  const cssPath = staticFile.path
  const downloadUrl = `https://cdn.skypack.dev/${packageName}@${packageVersion}/${cssPath}`
  const outFile = Path.absolute(`static/lib-css/${packageName}.css`)
  await downloadFile(downloadUrl, outFile)
}

const getText = async (url) => {
  try {
    return await got(url).text()
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to get text for ${url}`)
  }
}

const getImportExportUrl = (line) => {
  const quote = line.includes("'") ? "'" : '"'
  const startIndex = line.indexOf(quote)
  const endIndex = line.lastIndexOf(quote)
  if (startIndex === -1 || endIndex === -1 || startIndex === endIndex) {
    throw new VError('failed to extract actual url')
  }
  return line.slice(startIndex + 1, endIndex)
}

const getActualFileUrl = (text) => {
  const lines = text.split('\n')
  for (const line of lines) {
    if (line.startsWith('export * from')) {
      const actualUrlRelative = getImportExportUrl(line)
      const actualUrl = `https://cdn.skypack.dev` + actualUrlRelative
      return actualUrl
    }
  }
  throw new VError('failed to extract actual url')
}

const parseImportExportUrl = (importExportUrl) => {
  if (importExportUrl.startsWith('/-/')) {
    const atVIndex = importExportUrl.indexOf('@v')
    const atVIndexDash = importExportUrl.indexOf('-', atVIndex)
    const version = importExportUrl.slice(atVIndex + 2, atVIndexDash)
    const name = importExportUrl.slice(3, atVIndex)
    return {
      name,
      version,
      filePath: '',
    }
  }
  throw new VError(`cannot parse import url ${importExportUrl}`)
}

const getOutFileNameJs = (name) => {
  if (name.startsWith('@')) {
    return name.slice(1).replace('/', '-')
  }
  return name
}

const downloadStaticFileJs = async (staticFile) => {
  const rootName = staticFile.name
  const rootVersion = staticFile.version
  const url = `https://cdn.skypack.dev/${rootName}@${rootVersion}`
  const text = await getText(url)
  const actualUrl = getActualFileUrl(text)
  const outFileName = getOutFileNameJs(rootName)
  const outFile = Path.absolute(`static/js/${outFileName}.js`)
  await downloadFile(actualUrl, outFile)
  const content = await readFile(outFile, 'utf8')
  const lines = content.split('\n')
  const replacements = []
  for (const line of lines) {
    if (line.startsWith('import')) {
      const importExportUrl = getImportExportUrl(line)
      const { name, version } = parseImportExportUrl(importExportUrl)
      await downloadStaticFileJs({ name, version })
      const outFileName = getOutFileNameJs(name)
      replacements.push({
        occurrence: importExportUrl,
        replacement: `./${outFileName}.js`,
      })
    } else {
      break
    }
  }
  if (replacements.length > 0) {
    let newContent = content
    for (const replacement of replacements) {
      newContent = newContent.replace(
        replacement.occurrence,
        replacement.replacement
      )
    }
    await writeFile(outFile, newContent)
  }
}

const downloadStaticFileCollection = async (staticFile) => {
  Assert.array(staticFile.urls)
  const name = staticFile.name
  for (const url of staticFile.urls) {
    const fileName = Path.baseName(url).replace(/\.mjs$/, '.js')
    const outFile = Path.absolute(`static/js/${name}/${fileName}`)
    await downloadFile(url, outFile)
  }
}

export const downloadStaticFile = async (staticFile) => {
  Assert.string(staticFile.name)
  Assert.string(staticFile.version)
  Assert.string(staticFile.type)
  switch (staticFile.type) {
    case 'css':
      return downloadStaticFileCss(staticFile)
    case 'javascript':
      return downloadStaticFileJs(staticFile)
    case 'file-collection':
      return downloadStaticFileCollection(staticFile)
    default:
      throw new Error(`unsupported file type ${staticFile.type}`)
  }
}
