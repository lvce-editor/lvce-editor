import { stat } from 'fs/promises'
import { join } from 'path'
import * as Root from '../Root/Root.js'

import { fileURLToPath } from 'url'

const getThemeJsonPath = () => {
  return join(
    Root.root,
    'extensions',
    'builtin.theme-slime',
    'color-theme.json'
  )
}

const getSelfUrl = () => {
  return fileURLToPath(import.meta.url)
}

export const sendTheme = async (req, res) => {
  console.time('stat')
  const themeJsonPath = getThemeJsonPath()
  const themeJsonStat = await stat(themeJsonPath)
  const selfUrl = getSelfUrl()
  const selfStat = await stat(selfUrl)
  const etag = `W/` + themeJsonStat.mtime + selfStat.mtime
  const ifNoneMatch = req.headers['if-none-match']
  console.timeEnd('stat')
  if (ifNoneMatch === etag) {
    res.writeHead(304)
    return res.end()
  }
  console.log('theme - cache miss')
  const ColorThemeFromJson = await import(
    '../ColorThemeFromJson/ColorThemeFromJson.js'
  )
  const JsonFile = await import('../JsonFile/JsonFile.js')
  const themeJson = await JsonFile.readJson(themeJsonPath)
  const themeCss = ColorThemeFromJson.createColorThemeFromJson('', themeJson)
  // TODO handle error?
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/css')
  res.setHeader('ETag', etag)
  // TODO set content type header
  res.end(themeCss)
}
