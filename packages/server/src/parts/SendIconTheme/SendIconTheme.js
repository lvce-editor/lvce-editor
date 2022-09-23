import { stat } from 'fs/promises'
import { join } from 'path'
import * as Root from '../Root/Root.js'

import { fileURLToPath } from 'url'

const getIconThemePath = () => {
  return join(
    Root.root,
    'extensions',
    'builtin.vscode-icons',
    'icon-theme.json'
  )
}

const getSelfUrl = () => {
  return fileURLToPath(import.meta.url)
}

export const sendIconThemeCss = async (req, res) => {
  console.time('stat-theme')
  const themeJsonPath = getIconThemePath()
  const themeJsonStat = await stat(themeJsonPath)
  const selfUrl = getSelfUrl()
  const selfStat = await stat(selfUrl)
  const etag = `W/` + themeJsonStat.mtime + selfStat.mtime
  const ifNoneMatch = req.headers['if-none-match']
  console.timeEnd('stat-theme')
  if (ifNoneMatch === etag) {
    res.writeHead(304)
    return res.end()
  }
  console.log('theme - cache miss')
  const IconThemeFromJson = await import(
    '../IconThemeFromJson/IconThemeFromJson.js'
  )
  const JsonFile = await import('../JsonFile/JsonFile.js')
  const themeJson = await JsonFile.readJson(themeJsonPath)
  const themeCss = IconThemeFromJson.getIconThemeCss(themeJson, themeJsonPath)
  // TODO handle error?
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/css')
  res.setHeader('ETag', etag)
  res.end(themeCss)
}
