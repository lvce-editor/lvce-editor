import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'
import * as HtmlFile from '../HtmlFile/HtmlFile.js'

export const getFile = (handle) => {
  return handle.getFile()
}

export const getText = async (handle) => {
  const file = await getFile(handle)
  const text = await HtmlFile.getText(file)
  return text
}

export const write = async (handle, content) => {
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

export const writeResponse = async (handle, response) => {
  const writable = await handle.createWritable()
  await response.body.pipeTo(writable)
}

export const getChildHandles = async (handle) => {
  Assert.object(handle)
  const handles = await Arrays.fromAsync(handle.values())
  return handles
}

export const getFileHandle = (handle, name) => {
  return handle.getFileHandle(name)
}
