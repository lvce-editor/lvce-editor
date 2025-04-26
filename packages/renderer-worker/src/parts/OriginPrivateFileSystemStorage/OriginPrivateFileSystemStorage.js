import * as OriginPrivateFileSystem from '../OriginPrivateFileSystem/OriginPrivateFileSystem.js'

export const clear = async () => {
  await OriginPrivateFileSystem.clear()
}

export const getText = async (key) => {
  await OriginPrivateFileSystem.readFile(`${key}.txt`)
}

export const getJson = async (key) => {
  const text = await OriginPrivateFileSystem.readFile(`${key}.json`)
  const parsed = JSON.parse(text)
  return parsed
}

export const setText = async (key, value) => {
  await OriginPrivateFileSystem.writeFile(`${key}.txt`, value)
}

export const setJson = async (key, value) => {
  const content = JSON.stringify(value, null, 2) + '\n'
  await OriginPrivateFileSystem.writeFile(`${key}.json`, content)
}

export const setJsonObjects = (objects) => {
  // TODO
}
