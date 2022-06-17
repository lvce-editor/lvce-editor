import { readFile } from 'node:fs/promises'
import { writeFile } from '../FileSystem/FileSystem.js'
import * as ReadJson from '../JsonFile/JsonFile.js'

let settings
let settingsPromise

const readSettings = async () => {
  // TODO allow jsonc
  if (!settings) {
    if (!settingsPromise) {
      settingsPromise = ReadJson.readJson('/tmp/settings.json')
    }
    await settingsPromise
  }
  return settings
}

const writeSettings = async () => {
  // TODO jsonc
  await writeFile(
    '/tmp/settings.json',
    JSON.stringify(settings, null, 2) + '\n'
  )
}

export const get = async (key) => {
  await readSettings()
  // TODO allow nested object get
  return settings[key]
}

export const set = async (key, value) => {
  await readSettings()
  // TODO allow nested object set?
  // how does vscode do it?
  settings[key] = value
  await writeSettings()
}
