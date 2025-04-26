import * as OriginPrivateFileSystem from '../OriginPrivateFileSystem/OriginPrivateFileSystem.js'

export const clear = async () => {
  await OriginPrivateFileSystem.clear()
}

export const getText = async (key) => {
  await OriginPrivateFileSystem.readFile(`${key}.txt`)
}

export const getJson = async (key) => {
  const text = await OriginPrivateFileSystem.readFile(`${key}.json`)
  if (!text) {
    return undefined
  }
  try {
    const parsed = JSON.parse(text)
    return parsed
  } catch {
    return undefined
  }
}

export const setText = async (key, value) => {
  await OriginPrivateFileSystem.writeFile(`${key}.txt`, value)
}

export const setJson = async (key, value) => {
  const content = JSON.stringify(value, null, 2) + '\n'
  await OriginPrivateFileSystem.writeFile(`${key}.json`, content)
}

export const setJsonObjects = async (objects) => {
  const promises = Object.entries(objects).map(([key, value]) => {
    return setJson(key, value)
  })
  await Promise.all(promises)
}
